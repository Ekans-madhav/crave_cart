from django.contrib import admin
from .models import NewsletterSubscriber, Offer

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'user', 'is_subscribed', 'subscribed_at')
    search_fields = ('email', 'user__email')

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'coupon_code', 'discount', 'active')
    list_filter = ('active',)
    search_fields = ('title', 'coupon_code')
