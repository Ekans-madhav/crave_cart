from django.contrib import admin
from .models import TodayOffer

@admin.register(TodayOffer)
class TodayOfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'discount', 'coupon_code', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'coupon_code')
