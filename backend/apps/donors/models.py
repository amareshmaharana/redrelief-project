from django.db import models

from utils.choices import BLOOD_GROUP_CHOICES


class Donor(models.Model):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="donor_profile")
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    last_donation_date = models.DateField(null=True, blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "donors_donor"

    def __str__(self):
        return f"Donor: {self.user.full_name}"
