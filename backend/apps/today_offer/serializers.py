from rest_framework import serializers
from .models import TodayOffer

class TodayOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodayOffer
        fields = ['id', 'title', 'description', 'discount', 'coupon_code', 'is_active']
