import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext.jsx';
import { loginSchema } from '../utils/validationSchemas.js';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    setError('');
    try {
      await login(values.email.trim(), values.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Check your credentials.';
      setError(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #20146B 0%, #1D64C2 50%, #19D0D8 100%)',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, overflow: 'visible' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #20146B 0%, #1D64C2 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 20px rgba(29, 100, 194, 0.3)',
              }}
            >
              <ShieldIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Super Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              CoU Bus Tracker Control Panel
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              autoComplete="username"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.4, fontSize: 16 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 3, textAlign: 'center' }}
          >
            Authorized personnel only. All actions are logged.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}