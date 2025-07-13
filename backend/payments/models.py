from django.db import models
from django.conf import settings  # ✅ Use this instead of direct import of User

class Payment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # ✅ FIXED
    plan_id = models.CharField(max_length=100)
    plan_name = models.CharField(max_length=100)
    amount = models.FloatField()
    razorpay_payment_id = models.CharField(max_length=200)
    razorpay_order_id = models.CharField(max_length=200)
    razorpay_signature = models.CharField(max_length=500)
    payment_status = models.CharField(max_length=20, default='success')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan_name} - ₹{self.amount}"
