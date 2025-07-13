from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser

    list_display = ('id', 'mobile', 'email', 'name', 'is_staff', 'is_superuser')
    search_fields = ('mobile', 'email', 'name')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('mobile',)}),
        (_('Personal info'), {'fields': ('name', 'email')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('mobile', 'is_staff', 'is_superuser'),
        }),
    )

    readonly_fields = ('last_login',)
