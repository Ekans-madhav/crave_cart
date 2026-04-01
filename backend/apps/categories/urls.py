from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MenuTypeViewSet, SortOptionViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'menu-types', MenuTypeViewSet, basename='menu-types')
router.register(r'sort-options', SortOptionViewSet, basename='sort-options')

urlpatterns = [
    path('', include(router.urls)),
]
