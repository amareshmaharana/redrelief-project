from django.contrib import admin

from apps.accounts.models import OTPVerification, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "mobile", "role", "is_active", "is_verified")
    search_fields = ("full_name", "mobile")
    list_filter = ("role", "is_active", "is_verified")


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ("id", "mobile", "purpose", "is_verified", "created_at", "expires_at")
    list_filter = ("purpose", "is_verified")
    search_fields = ("mobile",)
