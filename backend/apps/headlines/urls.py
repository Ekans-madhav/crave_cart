from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HeadlineViewSet, SiteFeatureViewSet

router = DefaultRouter()
router.register(r'headlines', HeadlineViewSet, basename='headline')
router.register(r'features', SiteFeatureViewSet, basename='feature')

urlpatterns = [
    path('', include(router.urls)),
]