import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  SystemUpdate as SystemUpdateIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Super Admins', icon: <GroupIcon />, path: '/super-admins' },
  { label: 'Server Config', icon: <SettingsIcon />, path: '/server-config' },
  { label: 'App Version', icon: <SystemUpdateIcon />, path: '/app-version' },
  { label: 'Broadcast Notice', icon: <CampaignIcon />, path: '/broadcast-notice' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          backgroundColor: '#fff',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #20146B 0%, #1D64C2 50%, #19D0D8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          CU
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            CoU Bus Tracker
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Super Admin
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };