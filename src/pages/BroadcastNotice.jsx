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
  Avatar,
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <CampaignIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Broadcast Notice
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, ml: 6.5 }}>
        Send a notice visible to all Flutter app users
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
              p: 2,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(239, 68, 68, 0.06) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.1)',
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              <CampaignIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                New Notice
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Will appear in the Flutter app's Notice screen
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <TextField
                label="Title"
                fullWidth
                size="small"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
              <TextField
                label="Body"
                fullWidth
                multiline
                minRows={4}
                size="small"
                {...register('body')}
                error={!!errors.body}
                helperText={errors.body?.message || 'Supports Bengali text'}
              />
              <TextField
                select
                label="Expires after"
                fullWidth
                size="small"
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

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SendIcon />}
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: '10px',
                    px: 4,
                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                    background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #D97706, #DC2626)',
                      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
                    },
                  }}
                >
                  {isSubmitting ? 'Broadcasting...' : 'Broadcast Notice'}
                </Button>
              </Box>
            </Stack>
          </form>

          {success && (
            <Alert
              severity="success"
              sx={{
                mt: 3,
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.04)',
                border: '1px solid rgba(16, 185, 129, 0.12)',
              }}
              onClose={() => setSuccess(null)}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                Broadcast successful — Notice #{success.id}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label={`Title: ${success.title}`} size="small" sx={{ fontWeight: 500, fontSize: '0.7rem' }} />
                <Chip
                  label={`Active until: ${new Date(success.expiresAt).toLocaleString()}`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                />
              </Stack>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
