from django.db import models
from django.utils import timezone

from utils.choices import BLOOD_GROUP_CHOICES


class BloodStock(models.Model):
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES)
    units = models.PositiveIntegerField(default=0)
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blood_stock_blood_stock"
        indexes = [
            models.Index(fields=["blood_group", "expiry_date"]),
        ]

    def __str__(self):
        return f"{self.blood_group} - {self.units} units"

    @property
    def is_expired(self):
        return self.expiry_date < timezone.localdate()
