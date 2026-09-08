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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          minWidth: 0,
          width: '100%',
        }}
      >
        <TopBar title={title} />
        <Toolbar sx={{ minHeight: { xs: 64, sm: 68 } }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2, md: 2.5 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 1400 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
