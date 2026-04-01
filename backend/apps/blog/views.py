from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import BlogHero, TrendingFoodStory, FoodGallery, BlogPost, ChefTip, FoodCulture, StreetFoodGuide, HealthyEating
from .serializers import (
    BlogHeroSerializer, TrendingFoodStorySerializer, FoodGallerySerializer, 
    BlogPostSerializer, ChefTipSerializer, FoodCultureSerializer, 
    StreetFoodGuideSerializer, HealthyEatingSerializer, PopularRecipeSerializer
)
from apps.products.models import Product

class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class BlogHeroViewSet(viewsets.ModelViewSet):
    queryset = BlogHero.objects.all()
    serializer_class = BlogHeroSerializer
    permission_classes = [IsAdminUserOrReadOnly]

class TrendingFoodStoryViewSet(viewsets.ModelViewSet):
    queryset = TrendingFoodStory.objects.all().order_by('-created_at')
    serializer_class = TrendingFoodStorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

class FoodGalleryViewSet(viewsets.ModelViewSet):
    queryset = FoodGallery.objects.all().order_by('-created_at')
    serializer_class = FoodGallerySerializer
    permission_classes = [IsAdminUserOrReadOnly]

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by('-created_at')
    serializer_class = BlogPostSerializer
    lookup_field = 'id' # Changed from slug to handle CRUD by ID
    permission_classes = [IsAdminUserOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            serializer.save(author=self.request.user)
        else:
            serializer.save()

class ChefTipViewSet(viewsets.ModelViewSet):
    queryset = ChefTip.objects.all().order_by('-created_at')
    serializer_class = ChefTipSerializer
    permission_classes = [IsAdminUserOrReadOnly]

class FoodCultureViewSet(viewsets.ModelViewSet):
    queryset = FoodCulture.objects.all().order_by('-created_at')
    serializer_class = FoodCultureSerializer
    permission_classes = [IsAdminUserOrReadOnly]

class StreetFoodGuideViewSet(viewsets.ModelViewSet):
    queryset = StreetFoodGuide.objects.all().order_by('-created_at')
    serializer_class = StreetFoodGuideSerializer
    permission_classes = [IsAdminUserOrReadOnly]

class HealthyEatingViewSet(viewsets.ModelViewSet):
    queryset = HealthyEating.objects.all().order_by('-created_at')
    serializer_class = HealthyEatingSerializer
    permission_classes = [IsAdminUserOrReadOnly]

class PopularRecipeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet to fetch Top 4 Rated Products for the Blog Sidebar
    """
    queryset = Product.objects.filter(available=True).order_by('-rating')[:4]
    serializer_class = PopularRecipeSerializer
