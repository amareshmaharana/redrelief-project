from django.db import models

from utils.file_validators import validate_hospital_doc


class Hospital(models.Model):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="hospital_profile")
    hospital_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    address = models.TextField()
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120)
    pincode = models.CharField(max_length=12)
    contact_person = models.CharField(max_length=120)
    verification_document = models.FileField(
        upload_to="hospital_docs/",
        validators=[validate_hospital_doc],
        null=True,
        blank=True,
    )
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "hospitals_hospital"

    def __str__(self):
        return self.hospital_name
