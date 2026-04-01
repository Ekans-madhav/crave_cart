from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from apps.cart.models import Cart, CartItem # To clear cart after order?

class OrderViewSet(viewsets.ModelViewSet):
    """
    Handles Order creation and management.
    Users can create and see only their orders.
    Admins can potentially see all.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admins can see all, regular users see only theirs
        if self.request.user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # We handle items creation from the current cart
        # In a real app, you move items from Cart to Order
        # But for this simple model, we assume total_price is provided or calculated.
        
        # Saving basic order info
        order = serializer.save(user=self.request.user)
        
        # Logic to move items from cart to order can go here.
        # This part depends on how you handle the Cart logic in the project.
        # If the user passes items array in JSON, you'd handle that manually.

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        from django.utils import timezone
        from datetime import timedelta
        order = self.get_object()
        
        # Already cancelled
        if order.status == 'Cancelled':
            return Response({"error": "Order is already cancelled."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Food preparing / Out for delivery / Delivered
        if order.status in ['Preparing', 'Out for delivery', 'Delivered']:
            return Response(
                {"error": f"Cancellation blocked. Order is already '{order.status}' and can no longer be stopped."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Accepted check (with time limit)
        if order.status == 'Accepted':
            # Check if more than 5 minutes have passed since the order was placed
            # In a real app, maybe check 'updated_at' for when it was accepted
            if timezone.now() > (order.created_at + timedelta(minutes=5)):
                return Response(
                    {"error": "Cancellation window closed. Orders cannot be cancelled after 5 minutes of restaurant acceptance."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Order placed (Pending) - Allowed
        order.status = 'Cancelled'
        order.save()
        return Response({"message": "Your order has been successfully cancelled.", "status": order.status})
