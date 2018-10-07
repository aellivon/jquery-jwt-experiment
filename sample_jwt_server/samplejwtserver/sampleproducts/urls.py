from django.urls import path
from .views import ProductSet


# Defining a set view
products =  ProductSet.as_view({
    'post': 'create_product',
    'get': 'list_product',
    'patch': 'toggle_is_active_product'
})

urlpatterns = [
    path('', products, name='products'),
]
