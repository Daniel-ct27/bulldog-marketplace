from email.policy import default
from nt import stat_result
from ssl import create_default_context
from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager



class MyAccountManager(BaseUserManager):
	def create_user(self, email, username, name, password=None):
		if not email:
			raise ValueError('Users must have an email address')
		if not username:
			raise ValueError('Users must have a username')

		user = self.model(
			email=self.normalize_email(email),
			username=username,
            name=name
		)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username,name, password):
		user = self.create_user(
			email=self.normalize_email(email),
			password=password,
			username=username,
            name=name
		)
		user.is_admin = True
		user.is_staff = True
		user.is_superuser = True
		user.save(using=self._db)
		return user





class Account(AbstractBaseUser):
    email               = models.EmailField(verbose_name="email",max_length=60, unique=True)
    username            = models.CharField(max_length=30, unique=True)
    name                = models.CharField(max_length=30, default="User")
    date_joined         = models.DateTimeField(verbose_name="date joined",auto_now_add=True)
    last_login          = models.DateTimeField(verbose_name="last login", auto_now=True)

    is_admin            = models.BooleanField(default=False)
    is_active           = models.BooleanField(default=True)
    is_staff            = models.BooleanField(default=False)
    is_superuser        = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username","name"]

    objects = MyAccountManager()



    def __str__(self):
        return self.email   

    # For checking permissions. to keep it simple all admin have ALL  permissons
    def has_perm(self,perm,obj=None):
        return self.is_admin 
    # Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)

    def has_module_perms(self, app_label):
        return True
	    

class Category(models.Model):

    __tablename__ = "categories"
    name = models.CharField(max_length=30, unique=True)
    description =  models.TextField(max_length=200)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "categories"
        verbose_name = "Category"
        verbose_name_plural = "Categories"



class Listing(models.Model):

    title = models.CharField(max_length=30, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    color = models.CharField(max_length=30, default="none")
    image = models.TextField(default="example")
    bought_status = models.BooleanField(default=False)


    #a foreign key linking an item to the individual that posted it
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="listings")
    #should be a foreign key linking it to a particular category
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="listings")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


    @classmethod
    def create_listing(cls, data):
        
        from backend.models import Account, Category
        # Get the user object by email
        user = Account.objects.get(email=data.get('userEmail'))
        
        # Get the category object by name (string from React)
        category_name = data.get('productCategory',"")
        try:
            category = Category.objects.get(name=category_name)
        except:
            
            category = Category.objects.get(name="Appliances")
        
        # Create listing
        listing = {"title":data.get('productName', 'Product'),
            "description":data.get('productDescription', 'None'),
            "price":int(data.get('productPrice', 0)),
            "color":data.get('productColor', 'Black'),
            "image":data.get('productImage', 'example'),
            "user":user,
            "category":category}
        print("hello4")
        return cls.objects.create(**listing)
       
    class Meta:
        db_table = "listings"


class HelpRequest(models.Model):

    title = models.CharField(max_length=30, unique=True)
    description = models.TextField(max_length=200)
    subject_area = models.CharField(max_length=30, unique=True)
    request_status = models.BooleanField(default=False)


    #foreign key linking each help request to the originator
    user = models.ForeignKey(Account,on_delete=models.CASCADE,related_name="help_requests")
    
    def __str__(self):
        return self.title

    @classmethod
    def create_help_request(cls, data):
        #user sends email, title, description and subject_area
        from backend.models import Account
        # Get the user object by email
        user = Account.objects.get(email=data.get('userEmail'))
        
        # Create help request from data
        request = {"title":data.get('taskTitle', 'Product'),
            "description":data.get('taskDescription', 'None'),
            "subject_area":data.get('category', "None"),
            "user":user
            }
        return cls.objects.create(**request)

    class Meta:
        db_table = "help_requests"



class Conversation(models.Model):

    __tablename__ = "conversation"

    user_one = models.ForeignKey(
        Account,
        related_name="conversation_user_one",
        on_delete=models.CASCADE
    )
    user_two = models.ForeignKey(
        Account,
        related_name="conversation_user_two",
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "conversations"
        verbose_name = "Conversation"
        verbose_name_plural = "Conversations"
        constraints = [
            models.UniqueConstraint(
                fields=["user_one", "user_two"],
                name="unique_user_pair"
            )
        ]

    def save(self, *args, **kwargs):
        # reorder IDs so (8,3) becomes (3,8)
        if self.user_one_id > self.user_two_id:
            self.user_one, self.user_two = self.user_two, self.user_one

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user_one} ↔ {self.user_two}"


class Message(models.Model):

    __tablename__ = "messages"

    conversation = models.ForeignKey(
        Conversation,
        related_name="messages",
        on_delete=models.CASCADE
    )

    sender = models.ForeignKey(
        Account,
        related_name="sent_messages",
        on_delete=models.CASCADE
    )

    content = models.TextField(max_length=1000)
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} at {self.sent_at}"

    class Meta:
        db_table = "messages"
        verbose_name = "Message"
        verbose_name_plural = "Messages"


