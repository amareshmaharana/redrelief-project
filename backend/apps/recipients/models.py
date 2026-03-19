from django.db import models


class Recipient(models.Model):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="recipient_profile")
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)
    id_proof_number = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "recipients_recipient"

    def __str__(self):
        return f"Recipient: {self.user.full_name}"
