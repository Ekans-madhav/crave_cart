from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'product_name', 'rating', 'feedback', 'name', 'email', 'location', 'created_at']
        read_only_fields = ('created_at',)
