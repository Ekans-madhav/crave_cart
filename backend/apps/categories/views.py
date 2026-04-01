from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Category, MenuType, SortOption
from .serializers import CategorySerializer, MenuTypeSerializer, SortOptionSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class MenuTypeViewSet(viewsets.ModelViewSet):
    queryset = MenuType.objects.all()
    serializer_class = MenuTypeSerializer
    permission_classes = [AllowAny]

class SortOptionViewSet(viewsets.ModelViewSet):
    queryset = SortOption.objects.all()
    serializer_class = SortOptionSerializer
    permission_classes = [AllowAny]
