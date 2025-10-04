from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import RegistrationForm, MyLoginForm

from django.http import JsonResponse
from .models import Listing,Account,HelpRequest
from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response
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

    
    

def register(request):
    context ={}
    if request.POST:
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            email= form.cleaned_data.get("email")
            password1 = form.cleaned_data.get("password1")
            account = authenticate(email=email,password=password1)
            login(request,account)
            return redirect("home")
        else:
            context["registration_form"] = form
    else:
        form = RegistrationForm()
        context["registration_form"] = form
    return render(request,'register.html',context )

def login_view(request):
    form = MyLoginForm(request.POST)
    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(username=username,password=password)
        if user is not None:
            print("User is valid",user)
            login(request,user)
            return render(request,"second.html",{})
        else:
            print("wrong username or password")
    else:
        print(form.errors)
    return render(request,'login.html',{"form":form})


def logout_view(request):
    logout(request)
    return redirect("home")

@api_view(['GET'])
def listing_view(request):

    listings = Listing.objects.all()
    products = [{"id":listing.id,"name":listing.title,"price":listing.price,"color":listing.color,"image":listing.image} for listing in listings]
    try:
        return Response(products,status=200)
    except:
        return Response([],status=500)
    