from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({
        "status": "online",
        "message": "CraveCart API is running",
        "version": "1.0.0"
    })

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.categories.urls')),
    path('api/', include('apps.products.urls')),
    path('api/', include('apps.newsletter.urls')),
    path('api/headlines/', include('apps.headlines.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/contact/', include('apps.contact.urls')),
    path('api/blog/', include('apps.blog.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/today-offer/', include('apps.today_offer.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/payments/', include('apps.payments.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
