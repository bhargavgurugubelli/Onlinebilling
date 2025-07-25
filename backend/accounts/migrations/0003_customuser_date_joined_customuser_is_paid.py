# Generated by Django 4.2.4 on 2025-07-21 15:24

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_customuser_is_trial_customuser_trial_expires_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="date_joined",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name="customuser",
            name="is_paid",
            field=models.BooleanField(default=False),
        ),
    ]
