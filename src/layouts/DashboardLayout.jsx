import { Box, Toolbar } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar.jsx';
import TopBar from '../components/TopBar.jsx';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/super-admins': 'Super Admins',
  '/server-config': 'Server Configuration',
  '/app-version': 'App Version',
  '/broadcast-notice': 'Broadcast Notice',
};

export default function DashboardLayout() {
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Super Admin';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: `${DRAWER_WIDTH}px` }}>
        <TopBar title={title} />
        <Toolbar sx={{ minHeight: { xs: 64, sm: 68 } }} />
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 },
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
