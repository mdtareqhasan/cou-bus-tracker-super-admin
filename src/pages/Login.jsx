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
  DirectionsBus as BusIcon,
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
        position: 'relative',
        overflow: 'hidden',
        background: '#0F172A',
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 30%, #312E81 50%, #4F46E5 70%, #06B6D4 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      />

      {/* Subtle grid pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
          top: '-100px',
          right: '-100px',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(30px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
          bottom: '-80px',
          left: '-80px',
          animation: 'float2 10s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(10deg)' },
          },
        }}
      />

      <Card
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          mx: 2,
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #06B6D4 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 8px 32px rgba(79, 70, 229, 0.4)',
              }}
            >
              <ShieldIcon sx={{ color: 'white', fontSize: 36 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', mt: 1 }}>
              Sign in to access the control panel
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                color: '#FCA5A5',
                '& .MuiAlert-icon': { color: '#EF4444' },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              autoComplete="username"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#818CF8' },
                '& .MuiFormHelperText-root': { color: '#FCA5A5' },
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
                    <LockIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#818CF8' },
                '& .MuiFormHelperText-root': { color: '#FCA5A5' },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                  boxShadow: '0 6px 24px rgba(79, 70, 229, 0.5)',
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 3,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.25)',
              fontSize: '0.7rem',
            }}
          >
            Authorized personnel only. All actions are logged.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
