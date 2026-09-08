import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LockReset as LockResetIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { createSuperAdminSchema, updateSuperAdminSchema } from '../utils/validationSchemas.js';

export default function SuperAdmins() {
  const { superAdmin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [resetting, setResetting] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/super-admin/manage');
      setAdmins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen message="Loading super admins..." />;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Super Admins
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage accounts with full system access
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreating(true)}
          sx={{
            borderRadius: '10px',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
          }}
        >
          Add Admin
        </Button>
      </Stack>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                '& th': {
                  px: 2.5,
                  py: 2,
                  textAlign: 'left',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(0,0,0,0.04)',
                  backgroundColor: 'rgba(0,0,0,0.01)',
                },
                '& td': {
                  px: 2.5,
                  py: 2,
                  fontSize: '0.85rem',
                  borderBottom: '1px solid rgba(0,0,0,0.03)',
                },
                '& tbody tr': {
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(79, 70, 229, 0.02)',
                  },
                },
                '& tbody tr:last-child td': {
                  borderBottom: 'none',
                },
              }}
            >
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th align="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: a.isActive
                              ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
                              : 'linear-gradient(135deg, #94A3B8, #64748B)',
                          }}
                        >
                          {a.fullName
                            ? a.fullName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
                            : 'SA'}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {a.fullName}
                        </Typography>
                      </Box>
                    </td>
                    <td>
                      <Typography sx={{ fontFamily: "'SF Mono', monospace", fontSize: '0.8rem', color: '#64748B' }}>
                        {a.email}
                      </Typography>
                    </td>
                    <td>
                      <Chip
                        label={a.isActive ? 'Active' : 'Disabled'}
                        size="small"
                        color={a.isActive ? 'success' : 'default'}
                        variant={a.isActive ? 'filled' : 'outlined'}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 26,
                          borderRadius: '8px',
                          ...(a.isActive && {
                            backgroundColor: 'rgba(16, 185, 129, 0.08)',
                            color: '#059669',
                          }),
                        }}
                      />
                    </td>
                    <td>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </Typography>
                    </td>
                    <td align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            size="small"
                            onClick={() => setEditing(a)}
                            sx={{
                              color: '#64748B',
                              '&:hover': { color: '#4F46E5', backgroundColor: 'rgba(79, 70, 229, 0.06)' },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset password" arrow>
                          <IconButton
                            size="small"
                            onClick={() => setResetting(a)}
                            sx={{
                              color: '#64748B',
                              '&:hover': { color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.06)' },
                            }}
                          >
                            <LockResetIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            currentAdmin?.id === a.id
                              ? 'You cannot delete your own account'
                              : 'Delete'
                          }
                          arrow
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={currentAdmin?.id === a.id}
                              onClick={() => setDeleting(a)}
                              sx={{
                                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.06)' },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <CreateDialog open={creating} onClose={() => setCreating(false)} onSuccess={load} />
      <EditDialog admin={editing} onClose={() => setEditing(null)} onSuccess={load} />
      <ResetPasswordDialog admin={resetting} onClose={() => setResetting(null)} onSuccess={load} />
      <ConfirmDialog
        open={!!deleting}
        title="Delete Super Admin"
        message={`Delete ${deleting?.fullName} (${deleting?.email})? This cannot be undone.`}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          try {
            await api.delete(`/super-admin/manage/${deleting.id}`);
            toast.success('Deleted');
            setDeleting(null);
            load();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
          }
        }}
      />
    </Box>
  );
}

function DialogShell({ open, onClose, title, children, onSubmit, isSubmitting, submitLabel }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: '1.1rem',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          py: 2.5,
        }}
      >
        {title}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ pt: '20px !important' }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ minWidth: 100 }}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function CreateDialog({ open, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createSuperAdminSchema),
    defaultValues: { fullName: '', email: '', password: '', isActive: true },
  });

  const onSubmit = async (values) => {
    try {
      await api.post('/super-admin/manage', values);
      toast.success('Super admin created');
      reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    }
  };

  return (
    <DialogShell open={open} onClose={onClose} title="Add Super Admin" onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting} submitLabel="Create">
      <Stack spacing={2.5}>
        <TextField label="Full name" fullWidth {...register('fullName')} error={!!errors.fullName} helperText={errors.fullName?.message} />
        <TextField label="Email" type="email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <TextField label="Password" type="password" fullWidth {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
        <FormControlLabel control={<Switch defaultChecked {...register('isActive')} />} label="Active" />
      </Stack>
    </DialogShell>
  );
}

function EditDialog({ admin, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(updateSuperAdminSchema),
    defaultValues: { fullName: admin?.fullName || '', isActive: admin?.isActive ?? true },
  });

  useEffect(() => {
    if (admin) {
      reset({ fullName: admin.fullName, isActive: admin.isActive });
    }
  }, [admin, reset]);

  const onSubmit = async (values) => {
    try {
      await api.put(`/super-admin/manage/${admin.id}`, values);
      toast.success('Updated');
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <DialogShell open={!!admin} onClose={onClose} title="Edit Super Admin" onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting} submitLabel="Save Changes">
      <Stack spacing={2.5}>
        <TextField label="Email" value={admin?.email || ''} disabled fullWidth />
        <TextField label="Full name" fullWidth {...register('fullName')} error={!!errors.fullName} helperText={errors.fullName?.message} />
        <FormControlLabel control={<Switch {...register('isActive')} />} label="Active" />
      </Stack>
    </DialogShell>
  );
}

function ResetPasswordDialog({ admin, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { newPassword: '' } });

  const onSubmit = async (values) => {
    try {
      await api.put(`/super-admin/manage/${admin.id}`, { newPassword: values.newPassword });
      toast.success('Password reset');
      reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <DialogShell open={!!admin} onClose={onClose} title={`Reset password for ${admin?.fullName}`} onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting} submitLabel="Reset">
      <TextField
        label="New password"
        type="password"
        fullWidth
        autoFocus
        {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
      />
    </DialogShell>
  );
}
