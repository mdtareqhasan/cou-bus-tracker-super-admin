import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  MenuItem,
  Chip,
} from '@mui/material';
import { Campaign as CampaignIcon, Send as SendIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import api from '../api/axios.js';
import { broadcastNoticeSchema } from '../utils/validationSchemas.js';

const EXPIRY_OPTIONS = [
  { value: 6, label: '6 hours' },
  { value: 12, label: '12 hours' },
  { value: 24, label: '1 day' },
  { value: 72, label: '3 days' },
  { value: 168, label: '1 week' },
  { value: 720, label: '1 month' },
];

export default function BroadcastNotice() {
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(broadcastNoticeSchema),
    defaultValues: {
      title: '',
      body: '',
      expiryHours: 24,
    },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/super-admin/notices/broadcast', values);
      setSuccess(data);
      toast.success('Notice broadcast successfully');
      reset({ title: '', body: '', expiryHours: 24 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Broadcast failed');
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Broadcast Notice
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Send a notice visible to all Flutter app users via the existing notice system.
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <CampaignIcon />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                New Notice
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Will appear in the Flutter app's Notice screen
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                fullWidth
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
              <TextField
                label="Body"
                fullWidth
                multiline
                minRows={4}
                {...register('body')}
                error={!!errors.body}
                helperText={errors.body?.message || 'Supports Bengali text'}
              />
              <TextField
                select
                label="Expires after"
                fullWidth
                defaultValue={24}
                {...register('expiryHours', { valueAsNumber: true })}
                error={!!errors.expiryHours}
                helperText={errors.expiryHours?.message || 'Notice disappears from Flutter app after this duration'}
              >
                {EXPIRY_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SendIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Broadcasting...' : 'Broadcast Notice'}
                </Button>
              </Box>
            </Stack>
          </form>

          {success && (
            <Alert severity="success" sx={{ mt: 3 }} onClose={() => setSuccess(null)}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Broadcast successful — Notice #{success.id}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label={`Title: ${success.title}`} size="small" />
                <Chip
                  label={`Active until: ${new Date(success.expiresAt).toLocaleString()}`}
                  size="small"
                  color="primary"
                />
              </Stack>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}