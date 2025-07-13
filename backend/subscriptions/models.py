from django.db import models
from django.conf import settings  # ✅ Use custom user model

class StripeCustomer(models.Model):
    user = models.OneToOneField(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # ✅ FIXED
    stripeCustomerId = models.CharField(max_length=255)
    stripeSubscriptionId = models.CharField(max_length=255)

    def __str__(self):
        return self.user.username


class Subscriber(models.Model):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email
