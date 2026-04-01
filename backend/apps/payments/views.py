from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Payment
from .serializers import PaymentSerializer
from apps.orders.models import Order
from apps.today_offer.models import CouponUsage
import uuid

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def process_payment(request):
    """
    Simulate a payment process. In real app, this would involve Stripe/Razorpay.
    """
    order_id = request.data.get('order_id')
    payment_method = request.data.get('payment_method', 'Card')
    amount = request.data.get('amount')
    coupon_code = request.data.get('coupon_code')
    
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if hasattr(order, 'payment'):
        # Payment already exists
        return Response({"error": "Payment already processed for this order"}, status=status.HTTP_400_BAD_REQUEST)
        
    # Simulate a transaction ID (if not provided by a real gateway)
    transaction_id = request.data.get('transaction_id', f"TXN-{uuid.uuid4().hex[:12]}")
    
    # Create the payment
    payment = Payment.objects.create(
        order=order,
        user=request.user,
        amount=amount,
        payment_method=payment_method,
        transaction_id=transaction_id,
        status='Success'
    )
    
    # Record Coupon Usage if applied
    if coupon_code:
        CouponUsage.objects.get_or_create(user=request.user, coupon_code=coupon_code)
    
    # Update Order status
    order.status = 'Order placed'
    order.save()
    
    serializer = PaymentSerializer(payment)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_payments(request):
    payments = Payment.objects.filter(user=request.user)
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)
