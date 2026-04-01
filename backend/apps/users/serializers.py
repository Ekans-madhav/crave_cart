from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_admin'] = self.user.is_staff or self.user.is_superuser
        data['email'] = self.user.email
        return data

class UserSerializer(serializers.ModelSerializer):
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'full_name', 'email', 'phone', 'is_staff', 'is_superuser', 'date_joined', 'is_subscribed')

    def get_is_subscribed(self, obj):
        try:
            return obj.newsletter_subscriber.is_subscribed
        except:
            return False

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('full_name', 'password', 'confirm_password', 'email', 'phone')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone=validated_data.get('phone', '')
        )
        return user
