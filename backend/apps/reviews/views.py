from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer
from apps.products.models import Product

@api_view(['GET'])
def get_reviews(request):
    product_id = request.query_params.get('product_id')
    if product_id:
        reviews = Review.objects.filter(product_id=product_id).order_by('-created_at')
    else:
        reviews = Review.objects.all().order_by('-created_at')
        
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_review(request):
    try:
        data = request.data.copy()
        user = request.user
        
        # Deriving user data
        data['user'] = user.id
        data['name'] = getattr(user, 'full_name', "") or user.email or user.username
        data['email'] = user.email or ""
        # Note: Defaulting location to "India"
        data['location'] = getattr(user, 'phone', "India") or "India"
        
        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
