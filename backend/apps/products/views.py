from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer, ProductReadSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('id')
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'today_offer']:
            return ProductReadSerializer
        return ProductSerializer

    from rest_framework.decorators import action
    from rest_framework.response import Response

    @action(detail=False, methods=['get'], url_path='today-offer')
    def today_offer(self, request):
        # Fallback: return any products if none marked? 
        # Or just return a limited set.
        products = Product.objects.all()[:4]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
