from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BlogHeroViewSet, TrendingFoodStoryViewSet, FoodGalleryViewSet, 
    BlogPostViewSet, ChefTipViewSet, FoodCultureViewSet, 
    StreetFoodGuideViewSet, HealthyEatingViewSet, PopularRecipeViewSet
)

router = DefaultRouter()
router.register(r'hero', BlogHeroViewSet, basename='blog-hero')
router.register(r'trending', TrendingFoodStoryViewSet, basename='blog-trending')
router.register(r'gallery', FoodGalleryViewSet, basename='blog-gallery')
router.register(r'posts', BlogPostViewSet, basename='blog-posts')
router.register(r'chef-tips', ChefTipViewSet, basename='blog-chef-tips')
router.register(r'food-culture', FoodCultureViewSet, basename='blog-food-culture')
router.register(r'street-guides', StreetFoodGuideViewSet, basename='blog-street-guides')
router.register(r'healthy-eating', HealthyEatingViewSet, basename='blog-healthy-eating')
router.register(r'popular-recipes', PopularRecipeViewSet, basename='blog-popular-recipes')

urlpatterns = [
    path('', include(router.urls)),
]
