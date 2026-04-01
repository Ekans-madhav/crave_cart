from django.db import models
from django.conf import settings

class TodayOffer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    discount = models.CharField(max_length=50, help_text="e.g. 50%, ₹100")
    coupon_code = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CouponUsage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    coupon_code = models.CharField(max_length=50)
    used_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'coupon_code')
