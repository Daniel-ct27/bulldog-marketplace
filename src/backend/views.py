from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import RegistrationForm, MyLoginForm

from django.http import JsonResponse
from .models import Listing,Account,HelpRequest
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