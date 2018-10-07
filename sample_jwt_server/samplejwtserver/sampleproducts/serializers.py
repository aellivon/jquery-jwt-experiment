from rest_framework import serializers

from .models import SampleProduct

class ListProductSerializer(serializers.ModelSerializer):
    """
        This lists all of the products
    """
    class Meta:
        model = SampleProduct
        fields = ('id', 'product_brand', 'product_name')

class CreateProductSerializer(serializers.ModelSerializer):
    """
        Create product serialzier
    """
    class Meta:
        model = SampleProduct
        fields = ('id','product_name', 'product_brand')


class IsActiveStatusProductSerializer(serializers.ModelSerializer):
    """
        Since we don't the product name and product brand when
            archiving/unarchiving a product, we created a new seriailer.

        Note: This assumes that a normal user can unarchive a product!
            This might be changed depending on the client requirements
    """

    class Meta:
        model = SampleProduct
        fields = ('is_active','id')
