from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone


mobile_validator = RegexValidator(
    regex=r"^\+?[1-9]\d{9,14}$",
    message="Mobile number must be in valid international format.",
)


class UserManager(BaseUserManager):
    def create_user(self, mobile=None, password=None, **extra_fields):
        if not mobile and not extra_fields.get("email"):
            raise ValueError("Mobile number or email is required.")

        # Store empty mobile as None so unique constraint isn't violated
        if not mobile:
            mobile = None

        user = self.model(mobile=mobile, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", User.Role.ADMIN)
        return self.create_user(mobile=mobile, password=password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        DONOR = "donor", "Donor"
        RECIPIENT = "recipient", "Recipient"
        HOSPITAL = "hospital", "Hospital"

    mobile = models.CharField(max_length=15, unique=True, null=True, blank=True, validators=[mobile_validator])
    email = models.EmailField(unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=Role.choices)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "mobile"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        db_table = "accounts_user"

    def __str__(self):
        return f"{self.full_name} ({self.role})"


class OTPVerification(models.Model):
    class Purpose(models.TextChoices):
        LOGIN = "login", "Login"
        REGISTER = "register", "Register"
        PASSWORD_RESET = "password_reset", "Password Reset"

    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, null=True, blank=True)
    mobile = models.CharField(max_length=15, validators=[mobile_validator], null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    purpose = models.CharField(max_length=30, choices=Purpose.choices, default=Purpose.LOGIN)
    otp_code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    attempts = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_otp_verification"
        indexes = [
            models.Index(fields=["mobile", "purpose", "created_at"]),
            models.Index(fields=["email", "purpose", "created_at"]),
        ]

    def __str__(self):
        return f"{self.mobile or self.email} - {self.purpose}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
