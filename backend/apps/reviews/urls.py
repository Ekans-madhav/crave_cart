from django.urls import path
from .views import get_reviews, submit_review

urlpatterns = [
    path('', get_reviews, name='get_reviews'),
    path('submit/', submit_review, name='submit_review'),
]
