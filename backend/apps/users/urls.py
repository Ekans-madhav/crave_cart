from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import RegisterView, ProfileView, MyTokenObtainPairView, check_user, login_view, get_users, change_password

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('users/', get_users, name='get_users'),
    path('check-user/', check_user, name='check_user'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', change_password, name='change_password'),
]
