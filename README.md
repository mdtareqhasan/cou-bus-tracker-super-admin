# CoU Bus Tracker — Super Admin Panel

Standalone React + Material-UI panel that controls the CoU Bus Tracker backend and the Flutter mobile app.

## Features

1. **Super Admin Authentication** — JWT-based login (`POST /api/super-admin/auth/login`)
2. **Super Admin CRUD** — Add / edit / delete / reset password for other super admins
3. **Server Configuration** — API base URL, admin panel URL, maintenance mode toggle, Play Store URL
4. **App Version Management** — Latest version, minimum version, force-update toggle, Bengali update message
5. **Notice Broadcasting** — Sends notices to all Flutter users (reuses existing `/api/notices/active`)

## Default Credentials

- **Email:** `superadmincou@gmail.com`
- **Password:** `Admin@123`

> The default account is created at backend startup by `SuperAdminDataInitializer` (BCrypt hash generated at runtime, guaranteed to verify).

## Quick Start

### 1. Backend must be running
```bash
cd "d:\Java Development\CoU Bus Tracker\Backend"
./mvnw spring-boot:run
```
Backend listens on `http://localhost:8080`. Flyway will run the new `V16__create_super_admins_and_app_config.sql` migration on first launch.

### 2. Install and run the panel
```bash
cd "d:\Java Development\CoU Bus Tracker\super_admin"
npm install
npm run dev
```
Opens on **http://localhost:5174**.

### 3. Production build
```bash
npm run build
# Deploy dist/ to Netlify / Vercel / S3 / Nginx
```

## Environment

`.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

For production, change to your deployed backend URL (e.g., `https://api.coubus.bd/api`).

## Backend Endpoints Added

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/super-admin/auth/login` | POST | public | Super admin login |
| `/api/super-admin/manage` | GET | SUPER_ADMIN | List super admins |
| `/api/super-admin/manage` | POST | SUPER_ADMIN | Create super admin |
| `/api/super-admin/manage/{id}` | PUT | SUPER_ADMIN | Update (incl. password reset) |
| `/api/super-admin/manage/{id}` | DELETE | SUPER_ADMIN | Delete (prevents self-delete) |
| `/api/super-admin/config` | GET | SUPER_ADMIN | List all config keys |
| `/api/super-admin/config` | PUT | SUPER_ADMIN | Bulk update config |
| `/api/super-admin/notices/broadcast` | POST | SUPER_ADMIN | Create notice (reuses NoticeService) |
| `/api/config` | GET | **public** | Flutter app fetches runtime config |

## Notes

- All changes to `/api/super-admin/config` are immediately reflected in `/api/config` (in-memory cache invalidated on update).
- Notice broadcasts appear in the Flutter app's existing `/api/notices/active` endpoint automatically.
- CORS already permits `http://localhost:5174` in the backend's `SecurityConfig` and `WebMvcConfig`.
- After first login, change the default password via the Super Admins page → Reset password action.
