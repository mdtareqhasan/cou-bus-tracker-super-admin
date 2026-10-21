import axios from 'axios';
import toast from 'react-hot-toast';

// Default to a same-origin relative path, exactly like the main admin panel.
// In dev, Vite proxies /api to VITE_API_PROXY_TARGET (see vite.config.js).
// In production, the panel is served by the same host that proxies /api to
// the backend (Nginx, or the rewrite in vercel.json), so no absolute URL —
// and no CORS — is needed. Set VITE_API_BASE_URL only for split deployments.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('super_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('super_admin_token');
      localStorage.removeItem('super_admin_data');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('You do not have permission for this action.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
