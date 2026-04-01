from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TodayOffer, CouponUsage
from .serializers import TodayOfferSerializer

class TodayOfferViewSet(viewsets.ModelViewSet):
    queryset = TodayOffer.objects.all().order_by('-created_at')
    serializer_class = TodayOfferSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        from apps.newsletter.models import NewsletterSubscriber
        user = request.user
        
        # If not authenticated
        if not user.is_authenticated:
            return Response(
                {"membership_required": True, "message": "Login and membership required."}, 
                status=200
            )

        # Admin check
        if user.is_staff or user.is_superuser:
            queryset = self.get_queryset()[:3]
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
            
        # Check for paid membership OR newsletter subscription
        is_paid_member = getattr(user, 'has_paid_membership', False)
        is_newsletter_subscriber = NewsletterSubscriber.objects.filter(user=user, is_subscribed=True).exists()

        if is_paid_member or is_newsletter_subscriber:
            used_codes = CouponUsage.objects.filter(user=user).values_list('coupon_code', flat=True)
            offers = self.get_queryset().filter(is_active=True).exclude(coupon_code__in=used_codes)[:3]
            serializer = self.get_serializer(offers, many=True)
            return Response(serializer.data)
        
        return Response(
            {"membership_required": True, "message": "Membership or Newsletter subscription required to unlock this offer."}, 
            status=200
        )

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def verify(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "Coupon code is required."}, status=400)
            
        offer = TodayOffer.objects.filter(coupon_code=code.upper(), is_active=True).first()
        if offer:
            return Response({
                "valid": True,
                "title": offer.title,
                "discount": offer.discount,
                "code": offer.coupon_code
            })
        return Response({"valid": False, "error": "Invalid or expired coupon code."}, status=404)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()
