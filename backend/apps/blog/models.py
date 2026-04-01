from django.db import models
from django.conf import settings
from django.utils.text import slugify

class BlogHero(models.Model):
    title = models.CharField(max_length=255, default="Food Stories & Recipes")
    subtitle = models.TextField(default="Discover delicious recipes, chef tips and food culture")
    media_file = models.FileField(upload_to='blog/hero/', help_text="Upload a GIF or Video for the hero section")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Blog Hero"
        verbose_name_plural = "Blog Hero"

class TrendingFoodStory(models.Model):
    title = models.CharField(max_length=255)
    image = models.FileField(upload_to='blog/trending/')
    preview = models.TextField(help_text="Short preview of the story")
    detail = models.TextField(help_text="Full detail of the story")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Trending Food Story"
        verbose_name_plural = "Trending Food Stories"

class FoodGallery(models.Model):
    image = models.FileField(upload_to='blog/gallery/')
    caption = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.caption if self.caption else f"Gallery Image {self.id}"

    class Meta:
        verbose_name = "Food Gallery"
        verbose_name_plural = "Food Galleries"

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    image = models.FileField(upload_to='blog/posts/')
    category = models.CharField(max_length=100)
    date = models.CharField(max_length=100, help_text="Display date string (e.g., Oct 12, 2023)")
    description = models.TextField(help_text="Brief description/excerpt")
    detail = models.TextField(help_text="Full article content")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"

class ChefTip(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='blog/chef_tips/')
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class FoodCulture(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='blog/culture/')
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class StreetFoodGuide(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='blog/street_guides/')
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class HealthyEating(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='blog/healthy/')
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
