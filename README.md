# Multi-Tenant Feature Flag Management System

A full-stack feature flag platform with a shared Node.js API and three independent React frontends for super admins, org admins, and end users.

## Project Structure

```
feature-flag-system/
├── backend/           # Express + MongoDB API
├── super-admin-app/   # Manage organizations (port 5173)
├── admin-app/         # Manage feature flags per org (port 5174)
└── user-app/          # Public feature flag checker (port 5175)
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: `mongodb://localhost:27017`)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API runs at **http://localhost:5000**.

Default super admin credentials (from `.env`):
- Email: `admin@byepo.com`
- Password: `admin123`

### 2. Super Admin App

```bash
cd super-admin-app
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173** — login and create organizations.

### 3. Admin App

```bash
cd admin-app
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5174** — register as an org admin, then manage feature flags.

### 4. User App

```bash
cd user-app
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5175** — check whether a feature is enabled (no auth required).

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `SUPER_ADMIN_EMAIL` | Super admin login email |
| `SUPER_ADMIN_PASSWORD` | Super admin login password |

### Frontends (`*/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (default: `http://localhost:5000`) |

## API Endpoints

### Super Admin
- `POST /api/super-admin/login`
- `GET /api/super-admin/organizations` (protected)
- `POST /api/super-admin/organizations` (protected)
- `GET /api/super-admin/organizations/public` (public)

### Org Admin Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Feature Flags
- `GET /api/flags` (org admin, scoped to JWT org)
- `POST /api/flags` (org admin)
- `PUT /api/flags/:id` (org admin)
- `DELETE /api/flags/:id` (org admin)
- `GET /api/flags/check?orgId=&feature=` (public)

## Typical Workflow

1. Start MongoDB and the backend API.
2. Log into the **super-admin-app** and create one or more organizations.
3. Open the **admin-app**, register with an organization, and create feature flags.
4. Use the **user-app** to check flag status by organization and feature key.

## Running All Apps

Open four terminal tabs:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Super Admin
cd super-admin-app && npm run dev

# Terminal 3 — Admin
cd admin-app && npm run dev

# Terminal 4 — User
cd user-app && npm run dev
```
