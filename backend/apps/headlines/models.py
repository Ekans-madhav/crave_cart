from django.db import models

class Headline(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Allow only one headline
        if not self.pk and Headline.objects.exists():
            Headline.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class SiteFeature(models.Model):
    icon = models.CharField(max_length=50, help_text="Emoji or Lucide icon name")
    title = models.CharField(max_length=100)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title