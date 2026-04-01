from rest_framework import serializers
from .models import Headline, SiteFeature

class HeadlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Headline
        fields = ['id', 'title']

class SiteFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteFeature
        fields = ['id', 'icon', 'title', 'description']