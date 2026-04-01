from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.cart.models import Cart, CartItem
from apps.cart.serializers import CartSerializer, CartItemSerializer
from apps.products.models import Product

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return the cart for the current user
        return Cart.objects.filter(user=self.request.user)

    def get_object(self):
        # We only have one cart per user
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request):
        cart = self.get_object()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response({
            "message": "Item added to cart", 
            "cart_item": CartItemSerializer(cart_item).data,
            "cart_total": cart.total_price
        })

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        cart = self.get_object()
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')

        if item_id is None or quantity is None:
            return Response({"error": "Item ID and quantity are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            quantity = int(quantity)
            if quantity > 0:
                cart_item.quantity = quantity
                cart_item.save()
                return Response({
                    "message": "Quantity updated",
                    "cart_item": CartItemSerializer(cart_item).data,
                    "cart_total": cart.total_price
                })
            else:
                cart_item.delete()
                return Response({
                    "message": "Item removed from cart",
                    "cart_total": cart.total_price
                })
        except (CartItem.DoesNotExist, ValueError):
            return Response({"error": "Item not found or invalid quantity"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = self.get_object()
        item_id = request.data.get('item_id')

        if not item_id:
            return Response({"error": "Item ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
            return Response({
                "message": "Item removed from cart",
                "cart_total": cart.total_price
            })
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def clear_cart(self, request):
        cart = self.get_object()
        cart.items.all().delete()
        return Response({"message": "Cart cleared", "cart_total": 0})
