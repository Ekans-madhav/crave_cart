from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer, MyTokenObtainPairSerializer
from django.utils.timezone import now
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """
    Secure Register View: Use Django's create_user() for automatic password hashing.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "message": "User created successfully.",
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Protected Profile View: Requires a valid JWT token.
    Used for retrieving and updating the authenticated user's profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_user(request):
    """
    Test endpoint to check if the user is still valid and in the DB.
    """
    return Response({"msg": "valid user"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, username=email, password=password)

    if user is not None:
        user.last_login = now()
        user.save()
        tokens = get_tokens_for_user(user)
        return Response({
            "message": "Login successful",
            "user_id": user.id,
            "email": user.email,
            "is_admin": user.is_staff,
            "tokens": tokens
        })
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_users(request):
    users = User.objects.all().order_by('-last_login')
    data = []
    for user in users:
        data.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_admin": user.is_staff,
            "last_login": user.last_login,
            "date_joined": user.date_joined
        })
    return Response(data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not user.check_password(old_password):
        return Response({"error": "Wrong current password"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
