from rest_framework import serializers
from .models import BlogHero, TrendingFoodStory, FoodGallery, BlogPost, ChefTip, FoodCulture, StreetFoodGuide, HealthyEating
from apps.products.models import Product

class BlogHeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogHero
        fields = '__all__'

class TrendingFoodStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrendingFoodStory
        fields = '__all__'

class FoodGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodGallery
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.full_name', default="Admin")

    class Meta:
        model = BlogPost
        fields = '__all__'

class ChefTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChefTip
        fields = '__all__'

class FoodCultureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCulture
        fields = '__all__'

class StreetFoodGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = StreetFoodGuide
        fields = '__all__'

class HealthyEatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthyEating
        fields = '__all__'

class PopularRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'rating']
