from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

from .models import SampleProduct

from .serializers import ListProductSerializer, CreateProductSerializer, IsActiveStatusProductSerializer

class ProductSet(ViewSet):
    """Product view set"""

    # This is a default permission class of the django rest framework
    #   You can add some custom permission class if you want to! 
    
    # The 'IsAuthenticated' class kicks out users who is not authenticated
    #   The user needs to present the token on their header if he wants to get in!
    
    # This is connected to the line 91 of the settings.py
    permission_classes = (IsAuthenticated,)

    def list_product(self, *args, **kwargs):
        """
            get list of products that is active
        """

        # active_objects is a custom 'object manager that was defined on the Common Info'
        # !!! active objects automatically returns the all objects marked as 'is_active'
        #   The active_objects could just be objects.filter
        products = SampleProduct.active_objects.filter()
        # Passing products to serializer so it can be returned by django rest framework
        serializer = ListProductSerializer(products, many=True)
        # Return data
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create_product(self, *args, **kwargs):
        """
            This creates a new product
        """

        # passing the user input fields to create a new product
        serializer=CreateProductSerializer(data=self.request.data)

        # checks if the user input is valid
        if serializer.is_valid():
            # if valid -> Save
            board=serializer.save()
            # return a status 201 which is created and the data that was created
            return Response(data=serializer.data,status=status.HTTP_201_CREATED)

        # if not valid return the errors with a status 400 which is bad request
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def toggle_is_active_product(self, *args, **kwargs):
        """
            This toggles the is active status of a product

            Note: This assumes that a normal user can unarchive a product!
                This might be changed depending on the client requirements
        """
        
        # gets the product that we must update!
        # gets the object or returns the 404 error!
        product = get_object_or_404(SampleProduct, pk=self.request.data['id'])

        # Make this product a serializer
        serializer=IsActiveStatusProductSerializer(instance=product,
                                                   data=self.request.data)

        # checks if the serializer is valid
        if serializer.is_valid():
            # updates the product
            serializer.save()
            # returns response ok and the data so that the front end can receive it
            return Response(serializer.data, status=status.HTTP_200_OK)

        # if not valid return the errors to the user
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)