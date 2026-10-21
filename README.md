# CoU Bus Tracker — Super Admin Panel

Standalone React + Material-UI panel that controls the CoU Bus Tracker backend and the Flutter mobile app.

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
cou-bus-tracker-super-admin/
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
├── vite.config.js                # Dev server + /api and /uploads proxy
├── .env.docker-backend           # `npm run dev` proxy target (port 8081)
├── .env.local-backend            # `npm run dev:local` proxy target (port 8080)
└── package.json
```

## Quick Start

### 1. Backend must be running

Either run the Spring Boot API directly:

```bash
cd cou-bus-tracker-api
mvn spring-boot:run
```

Backend listens on `http://localhost:8080`.

Or use the Docker setup, which keeps the container on 8080 but publishes it
on **8081** (host 8080 is needed by another local service):

```bash
cd cou-bus-tracker-api
docker compose up -d --build app   # -> http://localhost:8081
```

### 2. Install and run the panel

```bash
npm install
npm run dev        # Docker backend  -> /api proxied to http://localhost:8081
npm run dev:local  # mvn backend     -> /api proxied to http://localhost:8080
```

Opens on **http://localhost:5174**. The browser calls the relative path `/api`,
and Vite forwards it to the target above — same-origin, so no CORS.

### 3. Production build

```bash
npm run build    # outputs to dist/
```

Deploy `dist/` behind Nginx on the API's VPS (see [Deployment](#deployment)).

## Environment Variables

The API base URL defaults to the relative path **`/api`**, exactly like the main
admin panel. The panel therefore works on any host without knowing the backend's
public URL, as long as that host forwards `/api` to the backend.

Resolution order for `src/api/axios.js`:

1. `VITE_API_BASE_URL` — only needed for split deployments (panel and API on
   different public origins).
2. Fallback: `/api` (same origin).

Resolution order for the dev-server proxy target (`vite.config.js`):

1. `VITE_API_PROXY_TARGET` from the active mode's env file
   (`.env.docker-backend` or `.env.local-backend`).
2. `.env.local` (gitignored, always loaded).
3. Default: `http://localhost:8081`.

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Override the API base URL at build time | `/api` |
| `VITE_API_PROXY_TARGET` | Dev/preview proxy target (backend origin) | `http://localhost:8081` |

`npm run dev` loads `.env.docker-backend` (Docker backend on 8081);
`npm run dev:local` loads `.env.local-backend` (`mvn spring-boot:run` on 8080).
Use `.env.local` to override either without touching tracked files.

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

Build once with `npm run build`; the output in `dist/` is a static SPA and does
**not** contain any backend URL. Whatever serves it only has to forward `/api`
to the API.

### Nginx on the API's VPS

This is the same pattern as the main admin panel: Nginx serves the static files
and proxies `/api` to Spring Boot, so the browser only ever talks to one origin
(no CORS, no build-time URL).

```nginx
server {
    listen 80;
    server_name superadmin.kubijatra.com;

    root /var/www/cou-super-admin/dist;
    index index.html;

    # Client-side routes (/dashboard, /server-config, ...)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API -> Spring Boot on the same machine
    location /api/ {
        proxy_pass http://127.0.0.1:8080;   # keep /api/... in the forwarded path
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
    }
}
```

Deploy steps:

```bash
npm run build
sudo mkdir -p /var/www/cou-super-admin
sudo rsync -a --delete dist/ /var/www/cou-super-admin/dist/
sudo nginx -t && sudo systemctl reload nginx
```

Then add HTTPS with `certbot --nginx -d superadmin.kubijatra.com`.

### CORS

Because Nginx serves both the panel and `/api` on the same origin, there is
**no cross-origin request at all**, so CORS does not apply. Only set
`VITE_API_BASE_URL` to a different origin when the panel and API are served
separately — in that case the backend must allow the panel's origin via
`WebMvcConfig.allowedOrigins` (it already permits `http://localhost:5174` for
local dev).

## Security Notes

- After first login, **change the default password** via Super Admins page
- Super admin JWT is stored in `localStorage` and auto-clears on 401/403
- `/api/super-admin/**` endpoints require `SUPER_ADMIN` role
- `/api/config` is public (no auth) — serves config to the Flutter app
