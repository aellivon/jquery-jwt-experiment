from django.db import models
from samplejwtserver.models import CommonInfo

class SampleProduct(CommonInfo):
    """
        Just a sample sample product

        Note: CommonInfo can just be (models.Manager)
            CommonInfo is just is just a common fields and a custom query filter

            By using common info -> This model (table) already have a fields
                is_active and date_updated already (since I defined it already on
                the common info)
    """
    
    product_name = models.CharField(max_length=225)
    product_brand = models.CharField(max_length=225)
