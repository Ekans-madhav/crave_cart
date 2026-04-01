from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import NewsletterSubscriber, Offer
from .serializers import NewsletterSubscriberSerializer, OfferSerializer

# Create your views here.

class SubscribeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            user=user,
            defaults={'email': user.email, 'is_subscribed': True}
        )
        if not created:
            subscriber.is_subscribed = True
            subscriber.save()
        
        return Response({"message": "Successfully subscribed to newsletter."}, status=status.HTTP_201_CREATED)

class TodayOfferView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            subscriber = NewsletterSubscriber.objects.get(user=user)
            if not subscriber.is_subscribed:
                return Response({"message": "Subscribe required"}, status=status.HTTP_403_FORBIDDEN)
        except NewsletterSubscriber.DoesNotExist:
            return Response({"message": "Subscribe required"}, status=status.HTTP_403_FORBIDDEN)

        # Fetch the latest active offer
        offer = Offer.objects.filter(active=True).order_by('-created_at').first()
        if not offer:
            return Response({"message": "No active offers today."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OfferSerializer(offer)
        return Response(serializer.data)
