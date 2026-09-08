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
import { Save as SaveIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import api from '../api/axios.js';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { serverConfigSchema } from '../utils/validationSchemas.js';

const CONFIG_FIELDS = [
  { key: 'api_base_url', label: 'API Base URL', desc: 'Backend URL consumed by the Flutter app' },
  { key: 'admin_panel_url', label: 'Admin Panel URL', desc: 'Main admin panel URL' },
  { key: 'super_admin_panel_url', label: 'Super Admin Panel URL', desc: 'This panel\'s URL' },
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
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Server Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage backend URLs and Flutter app maintenance state
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {CONFIG_FIELDS.map((f) => {
                const name = f.key.replace(/_(\w)/g, (_, c) => c.toUpperCase());
                return (
                  <TextField
                    key={f.key}
                    label={f.label}
                    fullWidth
                    {...register(name)}
                    error={!!errors[name]}
                    helperText={errors[name]?.message || f.desc}
                  />
                );
              })}

              <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Maintenance Mode
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  When enabled, the Flutter app shows a full-screen maintenance message and blocks all functionality.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={<Switch {...register('maintenanceMode')} />}
                      label={errors.maintenanceMode ? 'Off (invalid)' : 'Maintenance ON/OFF'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Maintenance message (Bengali)"
                      fullWidth
                      multiline
                      minRows={2}
                      {...register('maintenanceMessage')}
                      error={!!errors.maintenanceMessage}
                      helperText={errors.maintenanceMessage?.message}
                    />
                  </Grid>
                </Grid>
              </Box>

              {Object.keys(errors).length > 0 && (
                <Alert severity="warning">
                  Please fix the errors above before saving.
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || !isDirty}
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