from django.contrib import admin
from backend.models import Account,Category,Listing,HelpRequest
from django.contrib.auth.admin import UserAdmin

# Register your models here.


class AccountAdmin(UserAdmin): #CReating a custome admin class
    list_display = ("email","username","date_joined","last_login","is_admin","is_staff") #Creating custom displays for each user
    search_fields = ("email","username") #creating serach fields with secarch keys
    readonly_fields =("date_joined","last_login") #fields that cannot be changed

    #mandatory for creating custom admin class
    filter_horizontal =()
    list_filter = ()
    fieldsets = ()


admin.site.register(Account,AccountAdmin)
admin.site.register(Category)
admin.site.register(Listing)
admin.site.register(HelpRequest)