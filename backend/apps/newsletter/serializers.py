from rest_framework import serializers
from .models import NewsletterSubscriber, Offer

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'user', 'email', 'is_subscribed', 'subscribed_at']
        read_only_fields = ['user', 'email', 'subscribed_at']

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['id', 'title', 'description', 'coupon_code', 'discount', 'active']
