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
  Chip,
} from '@mui/material';
import { Save as SaveIcon, SystemUpdate as SystemUpdateIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import api from '../api/axios.js';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { appVersionSchema } from '../utils/validationSchemas.js';

export default function AppVersion() {
  const [configMap, setConfigMap] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(appVersionSchema),
    defaultValues: {
      latestAppVersion: '',
      minimumAppVersion: '',
      forceUpdate: false,
      updateAvailableMessage: '',
    },
  });

  useEffect(() => {
    api.get('/super-admin/config').then(({ data }) => {
      const m = {};
      data.forEach((c) => { m[c.configKey] = c.configValue; });
      setConfigMap(m);
      reset({
        latestAppVersion: m.latest_app_version || '',
        minimumAppVersion: m.minimum_app_version || '',
        forceUpdate: m.force_update === 'true',
        updateAvailableMessage: m.update_available_message || '',
      });
    });
  }, [reset]);

  const forceUpdate = watch('forceUpdate');

  const onSubmit = async (values) => {
    try {
      await api.put('/super-admin/config', {
        values: {
          latest_app_version: values.latestAppVersion,
          minimum_app_version: values.minimumAppVersion,
          force_update: String(values.forceUpdate),
          update_available_message: values.updateAvailableMessage,
        },
      });
      toast.success('App version settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  if (!configMap) return <LoadingScreen message="Loading version settings..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06B6D4, #0EA5E9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <SystemUpdateIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            App Version Management
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, ml: 6.5 }}>
        Control Flutter app update behavior
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Latest Version"
                  fullWidth
                  size="small"
                  {...register('latestAppVersion')}
                  error={!!errors.latestAppVersion}
                  helperText={errors.latestAppVersion?.message || 'Current published version (e.g., 1.2.0)'}
                />
                <TextField
                  label="Minimum Version"
                  fullWidth
                  size="small"
                  {...register('minimumAppVersion')}
                  error={!!errors.minimumAppVersion}
                  helperText={errors.minimumAppVersion?.message || 'Versions below this are blocked'}
                />
              </Stack>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  backgroundColor: forceUpdate ? 'rgba(239, 68, 68, 0.04)' : 'rgba(79, 70, 229, 0.04)',
                  border: `1px solid ${forceUpdate ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.08)'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <SystemUpdateIcon
                    sx={{
                      color: forceUpdate ? '#EF4444' : '#4F46E5',
                      transition: 'color 0.2s ease',
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <FormControlLabel
                      control={<Switch {...register('forceUpdate')} />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            Force Update
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {forceUpdate
                              ? 'Users on outdated versions will be blocked'
                              : 'Users get a soft update prompt only'}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                  <Chip
                    label={forceUpdate ? 'BLOCKING' : 'OPTIONAL'}
                    color={forceUpdate ? 'error' : 'success'}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      height: 24,
                      borderRadius: '6px',
                    }}
                  />
                </Stack>
              </Box>

              <TextField
                label="Update message (Bengali)"
                fullWidth
                multiline
                minRows={3}
                size="small"
                {...register('updateAvailableMessage')}
                error={!!errors.updateAvailableMessage}
                helperText={errors.updateAvailableMessage?.message || 'Shown to users when an update is available'}
              />

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
                  {isSubmitting ? 'Saving...' : 'Save Version Settings'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Alert
        severity="info"
        sx={{
          mt: 3,
          borderRadius: '12px',
          backgroundColor: 'rgba(59, 130, 246, 0.04)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          '& .MuiAlert-icon': { color: '#3B82F6' },
        }}
        icon={<SystemUpdateIcon />}
      >
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          <strong>Tip:</strong> When you release a new version on the Play Store, bump <strong>Latest Version</strong>{' '}
          and (if required) enable <strong>Force Update</strong>. Existing users will see the update prompt on next launch.
        </Typography>
      </Alert>
    </Box>
  );
}
