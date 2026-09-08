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
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
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
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255,255,255,0.85)',
      }}
    >
      <Toolbar sx={{ pl: { sm: 3 }, pr: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {superAdmin?.fullName || 'Super Admin'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {superAdmin?.email}
            </Typography>
          </Box>
          <IconButton onClick={handleOpen} size="small">
            <Avatar
              sx={{
                width: 38,
                height: 38,
                background: 'linear-gradient(135deg, #20146B 0%, #1D64C2 100%)',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}