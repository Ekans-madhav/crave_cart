from rest_framework import serializers
from apps.cart.models import Cart, CartItem
from apps.products.models import Product

class ProductCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductCartSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'added_at']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_cart_price = serializers.DecimalField(
        source='total_price', max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_cart_price', 'created_at', 'updated_at']
