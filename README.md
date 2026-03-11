<div align="center">

# 🩸 RedRelief — Blood Donation Management System

A full-stack web application for centralized blood donation management, connecting donors, recipients, hospitals, and administrators on a single platform.

**Built with Django REST Framework + React + TypeScript**

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.1-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [User Roles](#user-roles)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)

---

## Overview

**RedRelief** is a centralized Blood Donation Management System (BDMS) designed to streamline the process of blood donation, stock management, and blood requests. The platform serves as a central blood bank where:

- **Donors** register and submit donation requests at scheduled blood camps
- **Recipients** view available blood stock and submit blood requests
- **Hospitals** access blood inventory and place requests for patients
- **Administrators** manage the entire system — users, camps, stock, and request approvals

All blood stock is centrally managed by RedRelief, ensuring a unified inventory that all stakeholders can rely on.

---

## Features

### 🔐 Authentication & Security
- JWT-based authentication with access/refresh token rotation
- OTP verification via Email (Resend SMTP) with console fallback
- Role-based access control (Admin, Donor, Recipient, Hospital)
- Forgot password flow with OTP verification
- Secure file upload validation (medical reports, ID proofs, hospital documents)

### 🩸 Blood Stock Management
- Central blood bank inventory (8 blood groups: A±, B±, AB±, O±)
- Real-time stock levels with available / low stock / expired categorization
- Automatic expiry cleanup on every stock query
- Low stock alerts dispatched to all admins
- Public blood stock summary (no login required)

### 📋 Request System
- **Donation Requests** — Donors request to donate at a camp, admin reviews & approves
- **Blood Requests** — Recipients and hospitals request blood, admin reviews & dispatches
- Approval auto-updates stock (increase on donation approval, decrease on blood request approval)
- File attachments: medical reports, ID proofs

### 🏕️ Blood Camp Management
- Admins create and schedule blood donation camps
- Camp announcements broadcast to all donors, recipients, and hospitals
- Public camp listing (no login required)

### 🔔 Real-Time Notifications
- Django Channels + Redis WebSocket for instant push notifications
- Notification types: info, success, warning, error
- Mark as read / mark all as read
- Low stock warnings, request status updates, camp announcements

### 📊 Admin Dashboard
- Aggregate statistics: total donors, recipients, hospitals, camps, blood units
- Pending donation & blood request counts
- Fulfilled request tracking
- Full user management (view, activate/deactivate, verify)

### 🎨 Modern Frontend
- Responsive design with Tailwind CSS + Shadcn/UI component library
- Role-specific dashboards with distinct color themes
- Framer Motion animations
- Dark/light mode ready
- Mobile-responsive dialogs and navigation

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.12** | Runtime |
| **Django 5.1** | Web framework |
| **Django REST Framework** | REST API |
| **Simple JWT** | Token-based authentication |
| **Django Channels** | WebSocket support |
| **Redis** | Channel layer for real-time communication |
| **MySQL** | Primary database |
| **Pillow** | Image/file processing |
| **Resend SMTP** | Email OTP delivery |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn/UI** | Component library (30+ Radix UI components) |
| **React Router DOM** | Client-side routing |
| **TanStack React Query** | Server state management |
| **Framer Motion** | Animations |
| **Recharts** | Dashboard charts |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |
| **Zod** | Schema validation |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       Client (Browser)                    │
│                React + TypeScript + Vite                  │
│                    (Port 8080)                            │
└──────────┬──────────────────────┬────────────────────────┘
           │ REST API (HTTP)      │ WebSocket (WS)
           ▼                      ▼
┌──────────────────────┐  ┌─────────────────────┐
│  Django REST Framework│  │  Django Channels     │
│  JWT Authentication   │  │  (ASGI)             │
│     (Port 8000)       │  │  ws/notifications/  │
└──────────┬───────────┘  └──────────┬──────────┘
           │                         │
           ▼                         ▼
┌──────────────────────┐  ┌─────────────────────┐
│    MySQL Database     │  │    Redis Server     │
│    (redrelief)        │  │  (Channel Layer)    │
│     Port 3306         │  │    Port 6379        │
└──────────────────────┘  └─────────────────────┘
```

---

## Project Structure

```
bdms-academic-project/
├── README.md
│
├── backend/                        # Django Backend
│   ├── manage.py
│   ├── requirements.txt
│   │
│   ├── config/                     # Project configuration
│   │   ├── settings.py             # Django settings
│   │   ├── urls.py                 # URL routing
│   │   ├── routing.py              # WebSocket routing
│   │   ├── asgi.py                 # ASGI entry point
│   │   └── wsgi.py                 # WSGI entry point
│   │
│   ├── apps/                       # Django applications
│   │   ├── accounts/               # User model, OTP, custom commands
│   │   ├── donors/                 # Donor profiles
│   │   ├── recipients/             # Recipient profiles
│   │   ├── hospitals/              # Hospital profiles & verification
│   │   ├── camps/                  # Blood donation camps
│   │   ├── blood_stock/            # Central blood inventory
│   │   ├── requests/               # Donation & blood requests
│   │   └── notifications/          # Notification model
│   │
│   ├── views/                      # API view handlers
│   │   ├── admin_views.py          # Admin management APIs
│   │   ├── auth_views.py           # Registration, login, OTP
│   │   ├── donor_views.py          # Donor-specific APIs
│   │   ├── hospital_views.py       # Hospital-specific APIs
│   │   ├── recipient_views.py      # Recipient-specific APIs
│   │   ├── notification_views.py   # Notification APIs
│   │   └── profile_views.py        # Profile, stats, public APIs
│   │
│   ├── serializers/                # DRF serializers
│   ├── services/                   # Business logic layer
│   │   ├── stock_service.py        # Stock increase/decrease/alerts
│   │   ├── request_service.py      # Request review logic
│   │   ├── notification_service.py # Notification dispatch
│   │   └── otp_service.py          # OTP generation & verification
│   │
│   ├── consumers/                  # WebSocket consumers
│   ├── permissions/                # Role-based permission classes
│   ├── utils/                      # Choices, validators, pagination
│   └── docs/                       # SQL schema reference
│
├── frontend/                       # React Frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   │
│   └── src/
│       ├── main.tsx                # App entry point
│       ├── App.tsx                 # Route definitions
│       │
│       ├── components/
│       │   ├── layout/             # Navbar, Footer, DashboardLayout
│       │   ├── dashboard/          # Dashboard widgets, charts
│       │   ├── dialogs/            # AddStock, FAQs, Eligibility, etc.
│       │   └── ui/                 # Shadcn/UI base components
│       │
│       ├── pages/
│       │   ├── public/             # Landing, About, Camps, BloodStocks
│       │   ├── auth/               # Login, Register, OTP, ForgotPassword
│       │   ├── admin/              # Dashboard, ManageStock, Requests, etc.
│       │   ├── donor/              # Dashboard, Camps, RequestDonation
│       │   ├── recipient/          # Dashboard, RequestBlood, BloodStock
│       │   └── hospital/           # Dashboard, RequestBlood, BloodStock
│       │
│       ├── lib/                    # API client, auth session, utilities
│       ├── hooks/                  # Custom React hooks
│       ├── types/                  # TypeScript type definitions
│       └── assets/                 # Images, logos
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download |
|---|---|---|
| **Python** | 3.12+ | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **MySQL** | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| **Redis** | 7.x+ | [redis.io](https://redis.io/downloads/) |
| **Bun** (optional) | Latest | [bun.sh](https://bun.sh/) — or use npm/yarn |

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bdms-academic-project.git
cd bdms-academic-project
```

### 2. Database Setup

Open MySQL and create the database:

```sql
CREATE DATABASE redrelief CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
py -3.12 -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create admin account
python manage.py createadmin
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies (using bun)
bun install

# Or using npm:
npm install
```

---

## Running the Application

### Start Redis Server

```bash
redis-server
```

### Start Backend (Terminal 1)

```bash
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

Backend runs at: **http://127.0.0.1:8000**

### Start Frontend (Terminal 2)

```bash
cd frontend
bun dev
# or: npm run dev
```

Frontend runs at: **http://localhost:8080**

### Access Points

| URL | Description |
|---|---|
| `http://localhost:8080` | Frontend application |
| `http://127.0.0.1:8000/admin/` | Django admin panel |
| `http://127.0.0.1:8000/api/` | API root |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/login` | Login and get JWT tokens |
| `POST` | `/api/send-otp` | Send OTP to email/mobile |
| `POST` | `/api/verify-otp` | Verify OTP code |
| `POST` | `/api/refresh-token` | Refresh expired access token |
| `POST` | `/api/forgot-password/send-otp` | Forgot password — send OTP |
| `POST` | `/api/forgot-password/reset` | Reset password with OTP |

### Admin (Requires Admin Role)

| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/admin/users` | List / create users |
| `GET/POST` | `/api/admin/camps` | List / create blood camps |
| `GET/POST` | `/api/admin/blood-stock` | List / add blood stock |
| `GET` | `/api/admin/hospitals-list` | List verified hospitals |
| `GET` | `/api/admin/requests` | Donation & blood requests dashboard |
| `PATCH` | `/api/admin/requests/donation/{id}/review` | Approve/reject donation |
| `PATCH` | `/api/admin/requests/blood/{id}/review` | Approve/reject blood request |
| `GET` | `/api/admin/dashboard-stats` | Dashboard aggregate stats |

### Donor (Requires Donor Role)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/donor/camps` | List available blood camps |
| `POST` | `/api/donor/donation-request` | Submit donation request |
| `GET` | `/api/donor/request-status` | Check donation request status |

### Recipient (Requires Recipient Role)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/recipient/blood-request` | Submit blood request |
| `GET` | `/api/recipient/stock` | View available blood stock |
| `GET` | `/api/recipient/request-status` | Check blood request status |

### Hospital (Requires Hospital Role)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/hospital/blood-request` | Submit blood request |
| `GET` | `/api/hospital/stock` | View available blood stock |
| `GET` | `/api/hospital/request-status` | Check blood request status |

### Common (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET/PATCH` | `/api/user/profile` | View / update profile |
| `POST` | `/api/user/change-password` | Change password |
| `GET` | `/api/notifications` | List notifications |
| `POST` | `/api/notifications/mark-read` | Mark notifications as read |

### Public (No Auth)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/camps` | List upcoming blood camps |
| `GET` | `/api/public/stock-summary` | Blood stock summary by group |

### WebSocket

| Protocol | Endpoint | Description |
|---|---|---|
| `WS` | `ws/notifications/` | Real-time notification stream |

---

## Database Schema

### Entity Relationship

```
User (accounts_user)
 ├── 1:1 ── Donor (donors_donor)
 ├── 1:1 ── Recipient (recipients_recipient)
 ├── 1:1 ── Hospital (hospitals_hospital)
 ├── 1:N ── Notification (notifications_notification)
 └── 1:N ── OTPVerification (accounts_otpverification)

BloodCamp (camps_blood_camp)
 └── created_by → User

DonationRequest (requests_app_donationrequest)
 ├── donor → Donor
 ├── camp → BloodCamp
 └── reviewed_by → User

BloodRequest (requests_app_bloodrequest)
 ├── requester → User
 └── reviewed_by → User

BloodStock (blood_stock_blood_stock)
 └── Fields: blood_group, units, expiry_date
```

### Key Tables

| Table | Description |
|---|---|
| `accounts_user` | All users (admin, donor, recipient, hospital) |
| `donors_donor` | Donor profiles with blood group, DOB, gender |
| `recipients_recipient` | Recipient profiles |
| `hospitals_hospital` | Hospital profiles with verification docs |
| `camps_blood_camp` | Scheduled blood donation camps |
| `blood_stock_blood_stock` | Central blood inventory (group, units, expiry) |
| `requests_app_donationrequest` | Donation requests from donors |
| `requests_app_bloodrequest` | Blood requests from recipients/hospitals |
| `notifications_notification` | System notifications |
| `accounts_otpverification` | OTP records |

---

## User Roles

| Role | Capabilities |
|---|---|
| **Admin** | Manage all users, camps, blood stock, approve/reject requests, view dashboard stats, receive low-stock alerts |
| **Donor** | View camps, submit donation requests, track request status, manage profile |
| **Recipient** | View blood stock availability, submit blood requests, track request status, manage profile |
| **Hospital** | View blood stock availability, submit blood requests for patients, track request status, manage profile |

### Role Color Themes

| Role | Primary Color | Accent |
|---|---|---|
| Admin | Red / Rose | `bg-red-600` |
| Donor | Emerald / Teal | `bg-emerald-600` |
| Recipient | Indigo / Cyan | `bg-indigo-600` |
| Hospital | Amber / Orange | `bg-amber-600` |

---

## Environment Variables

The backend uses these environment variables (with defaults in `settings.py`):

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | (generated) | Django secret key |
| `DEBUG` | `True` | Debug mode |
| `MYSQL_DATABASE` | `redrelief` | MySQL database name |
| `MYSQL_USER` | `root` | MySQL username |
| `MYSQL_PASSWORD` | `my@sql0987` | MySQL password |
| `MYSQL_HOST` | `127.0.0.1` | MySQL host |
| `MYSQL_PORT` | `3306` | MySQL port |
| `REDIS_URL` | `redis://127.0.0.1:6379` | Redis connection URL |
| `ACCESS_TOKEN_LIFETIME_MINUTES` | `30` | JWT access token lifetime |
| `REFRESH_TOKEN_LIFETIME_DAYS` | `7` | JWT refresh token lifetime |
| `LOW_STOCK_THRESHOLD` | `5` | Units below which low-stock alert fires |
| `RESEND_API_KEY` | — | Resend API key for email OTP |

---

## Screenshots

> Screenshots can be added here to showcase the application UI.

| Page | Description |
|---|---|
| Landing Page | Public homepage with blood stock overview and camp info |
| Admin Dashboard | Statistics cards, charts, and management panels |
| Blood Stock (Admin) | Aggregated stock with available / low / expired filters |
| Donor Dashboard | Camp listings and donation request form |
| Recipient Dashboard | Blood stock viewer and request submission |
| Hospital Dashboard | Blood inventory and request management |

---

## Custom Management Commands

| Command | Description |
|---|---|
| `python manage.py createadmin` | Interactive admin user creation |
| `python manage.py migrate` | Apply all database migrations |

---

## License

This project is developed for academic purposes.

---

<div align="center">

**RedRelief** — *Every drop counts, every life matters.*

</div>