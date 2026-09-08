import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  SystemUpdate as SystemUpdateIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
  { label: 'Super Admins', icon: <GroupIcon fontSize="small" />, path: '/super-admins' },
  { label: 'Server Config', icon: <SettingsIcon fontSize="small" />, path: '/server-config' },
  { label: 'App Version', icon: <SystemUpdateIcon fontSize="small" />, path: '/app-version' },
  { label: 'Broadcast Notice', icon: <CampaignIcon fontSize="small" />, path: '/broadcast-notice' },
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
          border: 'none',
          borderRight: '1px solid rgba(0,0,0,0.04)',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '-0.02em',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            }}
          >
            CU
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#0F172A' }}>
              CoU Bus Tracker
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
              Super Admin Panel
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2 }}>
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.04)' }} />
      </Box>

      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={active}
                sx={{
                  borderRadius: '10px',
                  position: 'relative',
                  color: active ? '#4F46E5' : '#64748B',
                  backgroundColor: active ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: active ? 'rgba(79, 70, 229, 0.12)' : 'rgba(0,0,0,0.03)',
                  },
                  '&::before': active
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: -8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 20,
                        borderRadius: '0 4px 4px 0',
                        background: 'linear-gradient(180deg, #4F46E5, #7C3AED)',
                      }
                    : undefined,
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                    minWidth: 36,
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: active ? 600 : 500,
                    fontSize: '0.875rem',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.04)', mb: 2 }} />
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(6, 182, 212, 0.06) 100%)',
            border: '1px solid rgba(79, 70, 229, 0.08)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem', lineHeight: 1.4, display: 'block' }}>
            CoU Bus Tracker Control Panel
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.65rem' }}>
            v1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
