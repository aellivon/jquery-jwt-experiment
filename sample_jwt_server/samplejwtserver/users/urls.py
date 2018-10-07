from django.contrib import admin
from django.urls import path, include
from django.urls import reverse
from django.views.generic.base import RedirectView

from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token


urlpatterns = [
    # implementing jwt login
    path('login/', obtain_jwt_token),
    # refreshes the token 
    path('token-refresh/', refresh_jwt_token),
]