# CoU Bus Tracker — Super Admin Panel

Standalone React + Material-UI panel that controls the CoU Bus Tracker backend and the Flutter mobile app.

**Live:** [cou-bus-tracker-super-admin.vercel.app](https://cou-bus-tracker-super-admin.vercel.app)

## Features

1. **Super Admin Authentication** — JWT-based login (`POST /api/super-admin/auth/login`)
2. **Dashboard** — System-wide stats (total admins, buses, students, teachers, notices)
3. **Super Admin CRUD** — Add / edit / delete / activate/deactivate super admin accounts
4. **Server Configuration** — API base URL, admin/super admin panel URLs, maintenance mode, Play Store URL
5. **App Version Management** — Latest version, minimum version, force-update toggle, Bengali update message
6. **Notice Broadcasting** — Send push notifications to all Flutter app users
7. **Modern UI** — Glassmorphism design with MUI 5, animated sidebar, responsive layout

## Default Credentials

| Field | Value |
|---|---|
| Email | `superadmincou@gmail.com` |
| Password | `Admin@123` |

> The default account is created at backend startup by `SuperAdminDataInitializer` (BCrypt hash generated at runtime, guaranteed to verify).

> **Change this password before any public deployment.**

## Tech Stack

| | |
|---|---|
| React | 18 |
| Vite | 5 |
| MUI | 5 (`@mui/material`, `@mui/icons-material`) |
| React Router | 6 |
| Axios | HTTP client |
| React Hook Form | Form management |
| Yup | Validation schemas |
| react-hot-toast | Toast notifications |

## Project Structure

```
super_admin/
├── api/                          # Vercel serverless functions
├── public/                       # Static assets
├── src/
│   ├── api/axios.js              # Axios instance + auth interceptor
│   ├── components/
│   │   ├── ConfirmDialog.jsx     # Reusable confirm dialog
│   │   ├── LoadingScreen.jsx     # Full-screen loading animation
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   └── TopBar.jsx            # Top bar with user menu
│   ├── context/AuthContext.jsx   # Super admin auth state
│   ├── layouts/DashboardLayout.jsx  # Sidebar + TopBar shell
│   ├── pages/
│   │   ├── Login.jsx             # Animated gradient login page
│   │   ├── Dashboard.jsx         # System-wide statistics
│   │   ├── SuperAdmins.jsx       # Manage super admin accounts
│   │   ├── ServerConfig.jsx      # Edit runtime config keys
│   │   ├── AppVersion.jsx        # Set Flutter version constraints
│   │   └── BroadcastNotice.jsx   # Send push notifications
│   ├── theme.js                  # MUI theme (glassmorphism palette)
│   └── utils/validationSchemas.js  # Yup schemas for forms
├── vercel.json                   # SPA rewrite rules
├── .env                          # Environment variables
└── package.json
```

## Quick Start

### 1. Backend must be running

```bash
cd Backend
mvn spring-boot:run
```

Backend listens on `http://localhost:8080`. Flyway runs `V16__create_super_admins_and_app_config.sql` on first launch.

### 2. Install and run the panel

```bash
cd super_admin
npm install
npm run dev
```

Opens on **http://localhost:5174**.

### 3. Production build

```bash
npm run build    # outputs to dist/
```

Deploy `dist/` to Vercel (or any static host).

## Environment Variables

`.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

For production, change to your deployed backend URL.

## Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Super admin login (animated gradient background) |
| `/` | Dashboard | System-wide statistics (admin/buses/students/teachers/notices count) |
| `/super-admins` | SuperAdmins | Create, activate/deactivate, delete super admin accounts |
| `/server-config` | ServerConfig | Edit runtime config (API URL, panel URLs, Play Store URL, maintenance mode) |
| `/app-version` | AppVersion | Set latest/minimum Flutter version, force-update flag |
| `/broadcast-notice` | BroadcastNotice | Send push notification messages to all app users |

## Backend Endpoints

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/super-admin/auth/login` | POST | public | Super admin login → returns JWT |
| `/api/super-admin/auth/me` | GET | SUPER_ADMIN | Current super admin profile |
| `/api/super-admin/manage` | GET | SUPER_ADMIN | List super admins |
| `/api/super-admin/manage` | POST | SUPER_ADMIN | Create super admin |
| `/api/super-admin/manage/{id}` | PUT | SUPER_ADMIN | Update (incl. password reset) |
| `/api/super-admin/manage/{id}` | DELETE | SUPER_ADMIN | Delete (prevents self-delete) |
| `/api/super-admin/config` | GET | SUPER_ADMIN | List all config keys |
| `/api/super-admin/config` | PUT | SUPER_ADMIN | Bulk update config values |
| `/api/super-admin/notices` | GET | SUPER_ADMIN | List broadcast notices |
| `/api/super-admin/notices` | POST | SUPER_ADMIN | Create broadcast notice |
| `/api/super-admin/notices/{id}` | DELETE | SUPER_ADMIN | Delete broadcast notice |
| `/api/config` | GET | **public** | Flutter app fetches runtime config |

## How It Works

- **Config flow:** Super admin saves config via `PUT /api/super-admin/config` → backend updates PostgreSQL `app_config` table + invalidates in-memory cache → Flutter app reads via public `GET /api/config`
- **Notice flow:** Super admin creates notice via `POST /api/super-admin/notices` → stored in `notices` table → Flutter app reads via `GET /api/notices/active`
- **Version flow:** Flutter app checks `latest_app_version`, `minimum_app_version`, and `force_update` from `GET /api/config` → shows update dialog if needed

## Deployment

### Vercel (recommended)

1. Push `super_admin/` to a Git repository
2. Import in Vercel dashboard
3. Set `VITE_API_BASE_URL` in Vercel environment variables (Settings → Environment Variables)
4. Deploy — `vercel.json` handles SPA rewrites automatically

### CORS

Backend's `SecurityConfig` and `WebMvcConfig` already permit:
- `http://localhost:5174` (local dev)
- `https://cou-bus-tracker-super-admin.vercel.app` (production)

Add new origins in `WebMvcConfig.allowedOrigins` if deploying elsewhere.

## Security Notes

- After first login, **change the default password** via Super Admins page
- Super admin JWT is stored in `localStorage` and auto-clears on 401/403
- `/api/super-admin/**` endpoints require `SUPER_ADMIN` role
- `/api/config` is public (no auth) — serves config to the Flutter app
