from django.db import models
from django.conf import settings
from apps.products.models import Product
from django.db.models import Avg

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=5)
    feedback = models.TextField(blank=True, null=True)
    # Storing these for quick access as requested
    name = models.CharField(max_length=255)
    email = models.EmailField()
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Save the review first
        super().save(*args, **kwargs)
        
        # Safely attempt to update product rating
        try:
            avg_rating = Review.objects.filter(product=self.product).aggregate(Avg('rating'))['rating__avg']
            if avg_rating is not None:
                # Use update instead of save if possible to avoid recursions, 
                # but models.Product.objects.filter(id=self.product.id).update(rating=...)
                # is safer.
                Product.objects.filter(id=self.product.id).update(rating=round(avg_rating, 1))
        except Exception as e:
            print(f"Warning: Could not update product rating: {e}")

    def __str__(self):
        return f"{self.name} - {self.product.name} ({self.rating} stars)"
