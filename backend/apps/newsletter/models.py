from django.db import models
from django.conf import settings

class NewsletterSubscriber(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='newsletter_subscriber')
    email = models.EmailField(unique=True)
    is_subscribed = models.BooleanField(default=False)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class Offer(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    coupon_code = models.CharField(max_length=50)
    discount = models.CharField(max_length=50) # Use e.g. "20%", "$10 off"
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.coupon_code}"
