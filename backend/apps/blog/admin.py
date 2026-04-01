from django.contrib import admin
from .models import BlogHero, TrendingFoodStory, FoodGallery, BlogPost, ChefTip, FoodCulture, StreetFoodGuide, HealthyEating

@admin.register(BlogHero)
class BlogHeroAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle")

@admin.register(TrendingFoodStory)
class TrendingFoodStoryAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "is_active")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "preview")

@admin.register(FoodGallery)
class FoodGalleryAdmin(admin.ModelAdmin):
    list_display = ("id", "caption", "created_at", "is_active")
    list_filter = ("is_active", "created_at")
    search_fields = ("caption",)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "date", "is_active")
    prepopulated_fields = {"slug": ("title",)}
    list_filter = ("category", "is_active", "created_at")
    search_fields = ("title", "description", "detail")

@admin.register(ChefTip)
class ChefTipAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "is_active")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "content")

@admin.register(FoodCulture)
class FoodCultureAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "is_active")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "content")

@admin.register(StreetFoodGuide)
class StreetFoodGuideAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "is_active")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "content")

@admin.register(HealthyEating)
class HealthyEatingAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "is_active")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "content")
