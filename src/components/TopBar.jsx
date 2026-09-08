import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title }) {
  const { superAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const initials = superAdmin?.fullName
    ? superAdmin.fullName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ pl: { sm: 2.5 }, pr: 2.5, minHeight: { xs: 64, sm: 68 } }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A' }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label="Super Admin"
            size="small"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              background: 'rgba(79, 70, 229, 0.08)',
              color: '#4F46E5',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 28,
              borderRadius: '8px',
              border: '1px solid rgba(79, 70, 229, 0.12)',
            }}
          />
          <Box
            onClick={handleOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              py: 1,
              px: 1.5,
              borderRadius: '12px',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.03)',
              },
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: '0.8rem' }}>
                {superAdmin?.fullName || 'Super Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                {superAdmin?.email}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                fontSize: 13,
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
              }}
            >
              {initials}
            </Avatar>
            <ArrowDownIcon
              sx={{
                color: '#94A3B8',
                fontSize: 18,
                display: { xs: 'none', sm: 'block' },
                transform: anchorEl ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                {superAdmin?.fullName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                {superAdmin?.email}
              </Typography>
            </Box>
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                color: '#EF4444',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#EF4444' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Sign Out
                </Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
