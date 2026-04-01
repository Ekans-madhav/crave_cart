from rest_framework import viewsets, permissions
from .models import Headline, SiteFeature
from .serializers import HeadlineSerializer, SiteFeatureSerializer

class HeadlineViewSet(viewsets.ModelViewSet):
    queryset = Headline.objects.all()
    serializer_class = HeadlineSerializer
    permission_classes = [permissions.AllowAny]

class SiteFeatureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteFeature.objects.all()
    serializer_class = SiteFeatureSerializer
    permission_classes = [permissions.AllowAny]
