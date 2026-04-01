from django.urls import path
from .views import process_payment, get_user_payments

urlpatterns = [
    path('process/', process_payment, name='process_payment'),
    path('my-payments/', get_user_payments, name='user_payments'),
]
