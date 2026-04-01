from django.contrib import admin
from .models import Category, MenuType, SortOption

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'image')
    search_fields = ('name',)

@admin.register(MenuType)
class MenuTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(SortOption)
class SortOptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'label', 'value')
