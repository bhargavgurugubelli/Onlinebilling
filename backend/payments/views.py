from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from .serializers import PaymentSerializer
from django.contrib.auth.models import User

# Create your views here.


@api_view(['POST'])
def store_payment(request):
    try:
        user = User.objects.get(id=request.data.get('user_id'))

        payment = Payment.objects.create(
            user=user,
            plan_id=request.data.get('plan_id'),
            plan_name=request.data.get('plan_name'),
            amount=request.data.get('amount'),
            razorpay_payment_id=request.data.get('razorpay_payment_id'),
            razorpay_order_id=request.data.get('razorpay_order_id'),
            razorpay_signature=request.data.get('razorpay_signature'),
            payment_status='success'
        )
        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
