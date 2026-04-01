from rest_framework import serializers
from .models import Product
from apps.categories.serializers import CategorySerializer, MenuTypeSerializer

class ProductSerializer(serializers.ModelSerializer):
    # Using nested serializers for GET representation if needed, 
    # but for CRUD we usually want to send IDs.
    # To have both, we can use primary_key_related_field or separate fields.
    
    class Meta:
        model = Product
        fields = "__all__"

class ProductReadSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, allow_null=True)
    menu_type = MenuTypeSerializer(read_only=True, allow_null=True)
    
    class Meta:
        model = Product
        fields = "__all__"
