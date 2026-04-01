from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductReadSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    # For details in GET /orders/
    product_details = ProductReadSerializer(source='product', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'full_name', 'email', 'phone', 
            'address', 'city', 'state', 'pincode', 'total_price', 
            'status', 'payment_method', 'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def create(self, validated_data):
        import logging
        logger = logging.getLogger(__name__)
        
        request = self.context.get('request')
        user = request.user if request else None
        
        # Pull raw items data from the request payload
        items_data = request.data.get('items', []) if request else []
        
        # Assign current user to validated data
        if user and not user.is_anonymous:
            validated_data['user'] = user
        
        # Clean validated data for Order object creation
        validated_data.pop('items', None)
        
        try:
            # Atomic creation of main order record
            order = Order.objects.create(**validated_data)
            logger.info(f"Order {order.id} created successfully for {user}")
            
            # Create sub-items
            for item_data in items_data:
                try:
                    product_id = item_data.get('product')
                    if not product_id:
                        logger.warning(f"Skipping item due to missing product ID: {item_data}")
                        continue
                        
                    OrderItem.objects.create(
                        order=order,
                        product_id=product_id,
                        quantity=item_data.get('quantity', 1),
                        price=item_data.get('price', 0)
                    )
                except Exception as item_err:
                    logger.error(f"Error creating OrderItem: {item_err}")
            
            return order
        except Exception as e:
            logger.error(f"CRITICAL Order Creation Failed: {e}")
            raise serializers.ValidationError(f"Could not create order: {str(e)}")
