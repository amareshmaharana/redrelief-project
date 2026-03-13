from django.core.management.base import BaseCommand

from apps.accounts.models import User


class Command(BaseCommand):
    help = "Create an admin account for BDMS"

    def handle(self, *args, **options):
        self.stdout.write("\n=== Create BDMS Admin ===\n")
        mobile = input("Mobile (e.g. +919876543210): ").strip()
        full_name = input("Full Name: ").strip()
        password = input("Password (min 8 chars): ").strip()

        if not mobile or not full_name or len(password) < 8:
            self.stderr.write("All fields required. Password must be at least 8 characters.")
            return

        if User.objects.filter(mobile=mobile, role="admin").exists():
            self.stderr.write(f"Admin with mobile {mobile} already exists.")
            return

        User.objects.create_user(
            mobile=mobile,
            full_name=full_name,
            role="admin",
            password=password,
            is_active=True,
        )
        self.stdout.write(self.style.SUCCESS(f"Admin '{full_name}' created successfully!"))
