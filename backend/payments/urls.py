from django.urls import path
from .views import store_payment

urlpatterns = [
    path('store-payment/', store_payment, name='store-payment'),
]
