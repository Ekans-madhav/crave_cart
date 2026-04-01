from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.FileField(upload_to="categories/", blank=True, null=True)

    def __str__(self):
        return self.name

class MenuType(models.Model):
    TYPE_CHOICES = [
        ("VEG", "Veg"),
        ("NONVEG", "Non-Veg"),
    ]
    name = models.CharField(max_length=10, choices=TYPE_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

class SortOption(models.Model):
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50, unique=True) # e.g. price-low, rating

    def __str__(self):
        return self.label
