from .models import Account
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(max_length=60, help_text="Required. Add a valid Email Address")

    class Meta:
        model = Account
        fields = ("email","username","name","password1","password2")



class MyLoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

