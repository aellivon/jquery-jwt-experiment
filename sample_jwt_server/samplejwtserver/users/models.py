from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from samplejwtserver.models import CommonInfo
from django.urls import reverse
import uuid

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin, CommonInfo):
    """ 
        overriding user model
        CommonInfo -> Is not needed, this is just extra fields so I wont' need
            to define it always!

        NOTE: You also have to tell the django on settings.py that you want to override
               the default django user
        (settings.py line 88)

        ANOTHER NOTE: This is also connected with the managers.py on the same folder
    """
    first_name = models.CharField(max_length=225)
    last_name = models.CharField(max_length=225)
    email = models.EmailField(max_length=500, unique=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)

    # oveerridng the username field to make the default email when logging in.
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ("first_name", "last_name")

    # Getting the default django user manager
    objects = UserManager()


    def __str__(self):
        return f"{self.email}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.handle = self.trimmed_email

        return super(User, self).save(*args, **kwargs)

    def get_short_name(self):
        return f"{self.first_name}"

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".title()

    @property
    def get_display_name(self):
        if self.first_name and self.last_name:
            return self.get_full_name
        return f"{self.email}"

    @property
    def trimmed_email(self):
        return self.email.split("@")[0]

