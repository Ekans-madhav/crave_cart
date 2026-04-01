from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodayOfferViewSet

router = DefaultRouter()
router.register(r'offers', TodayOfferViewSet, basename='today-offer')

urlpatterns = [
    path('', include(router.urls)),
]
