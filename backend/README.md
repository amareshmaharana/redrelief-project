# JeevanBindu Backend (Django + MySQL + DRF + JWT + Channels)

This backend is built for:
- React frontend integration
- Role-based access (`admin`, `donor`, `recipient`, `hospital`)
- OTP authentication flows
- Forgot password flow (OTP based)
- Real-time notifications over WebSocket
- File uploads (medical reports, ID proofs, hospital docs)

## Project Structure

```text
backend/
├── config/
├── apps/
│   ├── accounts/
│   ├── donors/
│   ├── recipients/
│   ├── hospitals/
│   ├── camps/
│   ├── blood_stock/
│   ├── requests/
│   └── notifications/
├── websocket/
├── serializers/
├── views/
├── consumers/
├── permissions/
├── services/
├── utils/
├── docs/
│   └── mysql_schema.sql
├── manage.py
├── requirements.txt
└── .env.example
```

## Setup

1. Create virtual environment and install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
- Copy `.env.example` values into your environment or `.env` loader setup.

3. Create MySQL DB:
```sql
CREATE DATABASE jeevanbindu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create admin:
```bash
python manage.py createsuperuser
```

6. Run server:
```bash
python manage.py runserver
```

7. Run ASGI server for websocket (recommended in prod):
```bash
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

8. Run Redis:
```bash
redis-server
```

## Authentication Flow

- `POST /api/register`
- `POST /api/login` (password required for admin/hospital; OTP-only for donor/recipient)
- `POST /api/send-otp`
- `POST /api/verify-otp` (returns JWT access/refresh for login/register)
- `POST /api/refresh-token`
- `POST /api/forgot-password/send-otp`
- `POST /api/forgot-password/reset`

## API Endpoints

### Admin
- `GET|POST|PUT|PATCH|DELETE /api/admin/users`
- `GET|POST|PUT|PATCH|DELETE /api/admin/camps`
- `GET /api/admin/requests`
- `PATCH /api/admin/requests/donation/<id>/review`
- `PATCH /api/admin/requests/blood/<id>/review`
- `GET|POST|PUT|PATCH|DELETE /api/admin/blood-stock`

### Donor
- `GET /api/donor/camps`
- `GET|POST /api/donor/donation-request`
- `GET /api/donor/request-status`

### Recipient
- `GET|POST /api/recipient/blood-request`
- `GET /api/recipient/stock`
- `GET /api/recipient/request-status`

### Hospital
- `GET|POST /api/hospital/blood-request`
- `GET /api/hospital/stock`
- `GET /api/hospital/request-status`

### Notifications
- `GET /api/notifications`
- `POST /api/notifications/mark-read`

## WebSocket

- Endpoint: `ws://<host>/ws/notifications/?token=<jwt_access_token>`
- Auth: JWT access token in query parameter.
- User-scoped channels: `user_<user_id>_notifications`

Event example:

```json
{
  "event": "notification.new",
  "title": "Blood Request Approved",
  "message": "Your request for A+ blood has been approved",
  "type": "success",
  "payload": {
    "request_id": 42,
    "status": "approved"
  },
  "timestamp": "2026-03-09T12:00:00+05:30"
}
```

## Business Logic Implemented

- Donation request `approved` => stock units increase.
- Blood request `approved` => stock units decrease.
- Expired stock entries are auto-zeroed during stock reads and request fulfillment.
- Low stock alerts trigger notifications to admins.
- New camp creation broadcasts notifications to donor/recipient/hospital roles.

## File Uploads

Validated for extension and max size:
- Medical reports
- ID proofs
- Hospital verification documents

Files are stored under `MEDIA_ROOT` (default: `backend/media/`).
