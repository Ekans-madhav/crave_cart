from django.urls import path
from .views import SubscribeView, TodayOfferView

urlpatterns = [
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('today-offer/', TodayOfferView.as_view(), name='today-offer'),
]
