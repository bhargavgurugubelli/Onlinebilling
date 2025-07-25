# Generated by Django 4.2.4 on 2025-07-14 02:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("subscriptions", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("plan_id", models.CharField(max_length=100)),
                ("plan_name", models.CharField(max_length=100)),
                ("amount", models.FloatField()),
                ("razorpay_payment_id", models.CharField(max_length=200)),
                ("razorpay_order_id", models.CharField(max_length=200)),
                ("razorpay_signature", models.CharField(max_length=500)),
                ("payment_status", models.CharField(default="success", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.RemoveField(
            model_name="subscriber",
            name="email",
        ),
        migrations.AddField(
            model_name="subscriber",
            name="mobile",
            field=models.CharField(default=0, max_length=15, unique=True),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name="StripeCustomer",
        ),
    ]
