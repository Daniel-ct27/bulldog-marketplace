from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import RegistrationForm, MyLoginForm

from django.http import JsonResponse
from .models import Listing,Account,HelpRequest,Conversation,Message
from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from . import search


# Create your views here.
@api_view(['POST'])
def home(request):

    email = request.data.get("email", "")
    password = request.data.get("password","")
    print(email,password)
    account = authenticate(email=email,password=password)

    if account:
        data = model_to_dict(account, fields=[ 'id', 'username', 'name', 'email'])
        return Response(data,status=200)
    else:
        return Response({},status=404)

    
    
@api_view(['POST'])
def register(request):
    email = request.data.get("email", "")
    username = request.data.get("username","")
    name = request.data.get("name","")
    password = request.data.get("password1","")

  

    if Account.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    user = Account.objects.create_user(username=username, email=email, password=password, name=name)
    user.save()

    authenticate(email=email,password=password)

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "name":name
    }, status=201)
    # context ={}
    # if request.POST:
    #     form = RegistrationForm(request.POST)
    #     if form.is_valid():
    #         form.save()
    #         email= form.cleaned_data.get("email")
    #         password1 = form.cleaned_data.get("password1")
    #         account = authenticate(email=email,password=password1)
    #         login(request,account)
    #         return redirect("home")
    #     else:
    #         context["registration_form"] = form
    # else:
    #     form = RegistrationForm()
    #     context["registration_form"] = form
    # return render(request,'register.html',context )



@api_view(['GET'])
def logout_view(request):
    logout(request)
    return Response({},status=200)
    

@api_view(['GET'])
def listing_view(request):

    listings = Listing.objects.all()
    products = [{"id":listing.id,"name":listing.title,"price":listing.price,"color":listing.color,"image":listing.image} for listing in listings]
    try:
        return Response(products,status=200)
    except:
        return Response([],status=500)



@api_view(['GET'])
def get_user(request):
    """Return the currently authenticated user's basic info.

    If no user is authenticated, returns an empty object.
    """
    try:
        if hasattr(request, 'user') and getattr(request.user, 'is_authenticated', False):
            data = model_to_dict(request.user, fields=['id', 'username', 'name', 'email'])
            return Response(data, status=200)
        return Response({}, status=200)
    except Exception as e:
        print('get_user error:', e)
        return Response({}, status=500)

@api_view(['GET'])
def semantic_search(request):
    query = request.query_params.get("q", "").strip()
    if not query:
        return Response([], status=200)

    if not search.is_ready():
        return Response(
            {"error": "Semantic index not loaded"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    query_vec = search.model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True,
    ).astype("float32")

    k = int(request.query_params.get("k", 8))
    k = max(1, min(k, len(search.product_ids)))
    min_score = float(request.query_params.get("min_score", 0.35))

    scores, neighbors = search.index.search(query_vec, k)
    ranked_ids = []
    for score, idx in zip(scores[0], neighbors[0]):
        if idx == -1:
            continue
        if score < min_score:
            continue
        ranked_ids.append((int(search.product_ids[idx]), float(score)))

    if not ranked_ids:
        return Response([], status=200)

    id_order = [item[0] for item in ranked_ids]

    listings = Listing.objects.filter(id__in=id_order)
    listing_map = {listing.id: listing for listing in listings}
    products = []
    for listing_id, score in ranked_ids:
        listing = listing_map.get(listing_id)
        if not listing:
            continue
        products.append(
            {
                "id": listing.id,
                "name": listing.title,
                "price": listing.price,
                "color": listing.color,
                "image": listing.image,
                "score": score,
            }
        )
    return Response(products, status=200)


@api_view(['POST'])
def add_listing_view(request):
    # Create and save the listing
    try:
        listing = Listing.create_listing(request.data) 
        return Response([],status=200)
    except Exception as e:
        print(e)
        return Response([],status=400)
    

@api_view(['POST'])
def add_help_view(request):
    print(request.data)

    # Create and save the help request
    try:
        help_request = HelpRequest.create_help_request(request.data) 
        return Response([],status=200)
    except Exception as e:
        print(e)
        return Response([],status=400)
    

@api_view(['GET'])
def get_users(request):
    try:
        users = Account.objects.all()
        # exclude the current user if request is authenticated
        if hasattr(request, 'user') and getattr(request.user, 'is_authenticated', False):
            users = users.exclude(id=request.user.id)

        user_list = [{"id": user.id, "username": user.username, "email": user.email, "name": user.name} for user in users]
        return Response(user_list, status=200)
    except Exception as e:
        print('get_users error:', e)
        return Response([], status=500)


@api_view(['POST'])
def get_or_create_conversation(request):
    """Get or create a conversation between two users.

    Expected JSON: { "other_user_id": <int> }
    Falls back to `user_id` in request body if not authenticated.
    Returns { conversation_id: int, created: bool }
    """
    try:
        other_id = request.data.get('other_user_id')
        if other_id is None:
            return Response({'error': 'other_user_id required'}, status=400)

        if hasattr(request, 'user') and getattr(request.user, 'is_authenticated', False):
            me_id = request.user.id
        else:
            me_id = request.data.get('user_id')

        if me_id is None:
            return Response({'error': 'user_id missing'}, status=400)

        if int(me_id) == int(other_id):
            return Response({'error': "cannot create conversation with yourself"}, status=400)

        a, b = sorted([int(me_id), int(other_id)])
        conv, created = Conversation.objects.get_or_create(user_one_id=a, user_two_id=b)
        return Response({'conversation_id': conv.id, 'created': bool(created)}, status=200)
    except Exception as e:
        print('get_or_create_conversation error:', e)
        return Response({'error': 'server error'}, status=500)


@api_view(['GET'])
def conversation_messages(request, conv_id: int):
    """Return messages for a conversation ordered by sent_at (oldest first)."""
    try:
        qs = Message.objects.filter(conversation_id=conv_id).order_by('sent_at')
        out = []
        for m in qs:
            out.append({
                'id': m.id,
                'sender_id': m.sender_id,
                'content': m.content,
                'sent_at': m.sent_at.isoformat(),
            })
        return Response(out, status=200)
    except Exception as e:
        print('conversation_messages error:', e)
        return Response([], status=500)


@api_view(['POST','OPTIONS'])
def send_message(request):
    """Create a message for a conversation and return it with sent_at."""
    try:
        # quick preflight handling
        if request.method == 'OPTIONS':
            return Response({}, status=204)

        conv_id = request.data.get('conversation_id')
        content = request.data.get('content', '')

        if not conv_id or content is None:
            return Response({'error': 'conversation_id and content required'}, status=400)

        if hasattr(request, 'user') and getattr(request.user, 'is_authenticated', False):
            sender_id = request.user.id
        else:
            sender_id = request.data.get('sender_id')

        if not sender_id:
            return Response({'error': 'sender_id required'}, status=400)

        try:
            conv = Conversation.objects.get(id=conv_id)
            sender = Account.objects.get(id=sender_id)
        except Conversation.DoesNotExist:
            return Response({'error': 'conversation not found'}, status=404)
        except Account.DoesNotExist:
            return Response({'error': 'sender not found'}, status=404)

        msg = Message.objects.create(conversation=conv, sender=sender, content=content)
        return Response({
            'id': msg.id,
            'sender_id': msg.sender_id,
            'content': msg.content,
            'sent_at': msg.sent_at.isoformat(),
        }, status=201)
    except Exception as e:
        print('send_message error:', e)
        return Response({'error': 'server error'}, status=500)
   