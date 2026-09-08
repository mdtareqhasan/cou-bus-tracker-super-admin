import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SuperAdmins from './pages/SuperAdmins.jsx';
import ServerConfig from './pages/ServerConfig.jsx';
import AppVersion from './pages/AppVersion.jsx';
import BroadcastNotice from './pages/BroadcastNotice.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/super-admins" element={<SuperAdmins />} />
        <Route path="/server-config" element={<ServerConfig />} />
        <Route path="/app-version" element={<AppVersion />} />
        <Route path="/broadcast-notice" element={<BroadcastNotice />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
