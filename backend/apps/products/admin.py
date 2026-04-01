from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'menu_type', 'price', 'is_special')
    list_filter = ('category', 'menu_type', 'available', 'is_special')
    search_fields = ('name',)
