from django.db import models
from apps.categories.models import Category, MenuType

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    menu_type = models.ForeignKey(MenuType, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    image = models.FileField(upload_to="products/", blank=True, null=True)
    available = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    is_special = models.BooleanField(default=False)

    def __str__(self):
        return self.name
