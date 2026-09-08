import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Grid,
} from '@mui/material';
import { Save as SaveIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import api from '../api/axios.js';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { serverConfigSchema } from '../utils/validationSchemas.js';

const CONFIG_FIELDS = [
  { key: 'api_base_url', label: 'API Base URL', desc: 'Backend URL consumed by the Flutter app' },
  { key: 'admin_panel_url', label: 'Admin Panel URL', desc: 'Main admin panel URL' },
  { key: 'super_admin_panel_url', label: 'Super Admin Panel URL', desc: "This panel's URL" },
  { key: 'play_store_url', label: 'Play Store URL', desc: 'Opened when users tap Update' },
];

export default function ServerConfig() {
  const [configMap, setConfigMap] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(serverConfigSchema),
    defaultValues: {
      apiBaseUrl: '',
      adminPanelUrl: '',
      superAdminPanelUrl: '',
      playStoreUrl: '',
      maintenanceMode: false,
      maintenanceMessage: '',
    },
  });

  useEffect(() => {
    api.get('/super-admin/config').then(({ data }) => {
      const m = {};
      data.forEach((c) => { m[c.configKey] = c.configValue; });
      setConfigMap(m);
      reset({
        apiBaseUrl: m.api_base_url || '',
        adminPanelUrl: m.admin_panel_url || '',
        superAdminPanelUrl: m.super_admin_panel_url || '',
        playStoreUrl: m.play_store_url || '',
        maintenanceMode: m.maintenance_mode === 'true',
        maintenanceMessage: m.maintenance_message || '',
      });
    });
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      await api.put('/super-admin/config', {
        values: {
          api_base_url: values.apiBaseUrl,
          admin_panel_url: values.adminPanelUrl,
          super_admin_panel_url: values.superAdminPanelUrl,
          play_store_url: values.playStoreUrl,
          maintenance_mode: String(values.maintenanceMode),
          maintenance_message: values.maintenanceMessage,
        },
      });
      toast.success('Server configuration saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  if (!configMap) return <LoadingScreen message="Loading configuration..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <SettingsIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Server Configuration
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, ml: 6.5 }}>
        Manage backend URLs and Flutter app maintenance state
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              {CONFIG_FIELDS.map((f) => {
                const name = f.key.replace(/_(\w)/g, (_, c) => c.toUpperCase());
                return (
                  <Box key={f.key}>
                    <TextField
                      label={f.label}
                      fullWidth
                      {...register(name)}
                      error={!!errors[name]}
                      helperText={errors[name]?.message || f.desc}
                      size="small"
                    />
                  </Box>
                );
              })}

              <Box
                sx={{
                  pt: 2.5,
                  mt: 1,
                  borderTop: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F59E0B',
                    }}
                  >
                    <SettingsIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Maintenance Mode
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 5.5, fontSize: '0.8rem' }}>
                  When enabled, the Flutter app shows a full-screen maintenance message and blocks all functionality.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={<Switch {...register('maintenanceMode')} />}
                      label={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {errors.maintenanceMode ? 'Off (invalid)' : 'Maintenance ON/OFF'}
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Maintenance message (Bengali)"
                      fullWidth
                      multiline
                      minRows={2}
                      size="small"
                      {...register('maintenanceMessage')}
                      error={!!errors.maintenanceMessage}
                      helperText={errors.maintenanceMessage?.message}
                    />
                  </Grid>
                </Grid>
              </Box>

              {Object.keys(errors).length > 0 && (
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: '10px',
                    backgroundColor: 'rgba(245, 158, 11, 0.04)',
                    border: '1px solid rgba(245, 158, 11, 0.12)',
                  }}
                >
                  Please fix the errors above before saving.
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || !isDirty}
                  sx={{
                    borderRadius: '10px',
                    px: 4,
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Configuration'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
