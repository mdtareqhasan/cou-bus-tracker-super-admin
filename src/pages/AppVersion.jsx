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
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        App Version Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Control Flutter app update behavior. Bump versions here to push updates to users.
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Latest Version"
                  fullWidth
                  {...register('latestAppVersion')}
                  error={!!errors.latestAppVersion}
                  helperText={errors.latestAppVersion?.message || 'Current published version (e.g., 1.2.0)'}
                />
                <TextField
                  label="Minimum Version"
                  fullWidth
                  {...register('minimumAppVersion')}
                  error={!!errors.minimumAppVersion}
                  helperText={errors.minimumAppVersion?.message || 'Versions below this are blocked'}
                />
              </Stack>

              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.default' }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <SystemUpdateIcon color={forceUpdate ? 'error' : 'primary'} />
                  <Box sx={{ flexGrow: 1 }}>
                    <FormControlLabel
                      control={<Switch {...register('forceUpdate')} />}
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Force Update
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {forceUpdate
                              ? 'Users on outdated versions will be blocked from using the app'
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
                  />
                </Stack>
              </Box>

              <TextField
                label="Update message (Bengali)"
                fullWidth
                multiline
                minRows={3}
                {...register('updateAvailableMessage')}
                error={!!errors.updateAvailableMessage}
                helperText={errors.updateAvailableMessage?.message || 'Shown to users when an update is available'}
              />

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
                  {isSubmitting ? 'Saving...' : 'Save Version Settings'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 3 }} icon={<SystemUpdateIcon />}>
        <Typography variant="body2">
          <strong>Tip:</strong> When you release a new version on the Play Store, bump <strong>Latest Version</strong>{' '}
          and (if required) enable <strong>Force Update</strong>. Existing users will see the update prompt on next
          launch.
        </Typography>
      </Alert>
    </Box>
  );
}