from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    # !!! This might not be the best practice !!!
    #  This renders the django without a view

    path('', TemplateView.as_view(template_name='login.html'),
        name='login'),
    path('index/', TemplateView.as_view(template_name='index.html'),
        name='index'),


]
