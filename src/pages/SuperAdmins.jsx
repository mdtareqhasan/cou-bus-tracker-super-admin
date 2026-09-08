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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LockReset as LockResetIcon,
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

  const [editing, setEditing] = useState(null);          // super admin being edited
  const [creating, setCreating] = useState(false);
  const [resetting, setResetting] = useState(null);      // id of admin whose password to reset
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
            Super Admin Accounts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage accounts with full system control
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreating(true)}>
          Add Super Admin
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
                '& th, & td': { p: 1.5, textAlign: 'left', fontSize: 14 },
                '& thead th': { fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' },
                '& tbody tr': { borderBottom: '1px solid', borderColor: 'divider' },
                '& tbody tr:last-child': { borderBottom: 'none' },
              }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th align="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.fullName}</td>
                    <td>{a.email}</td>
                    <td>
                      <Chip
                        label={a.isActive ? 'Active' : 'Disabled'}
                        size="small"
                        color={a.isActive ? 'success' : 'default'}
                        variant={a.isActive ? 'filled' : 'outlined'}
                      />
                    </td>
                    <td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}</td>
                    <td align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setEditing(a)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset password">
                          <IconButton size="small" onClick={() => setResetting(a)}>
                            <LockResetIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            currentAdmin?.id === a.id
                              ? 'You cannot delete your own account'
                              : 'Delete'
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={currentAdmin?.id === a.id}
                              onClick={() => setDeleting(a)}
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Super Admin</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Full name" fullWidth {...register('fullName')} error={!!errors.fullName} helperText={errors.fullName?.message} />
            <TextField label="Email" type="email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Password" type="password" fullWidth {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
            <FormControlLabel control={<Switch defaultChecked {...register('isActive')} />} label="Active" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
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
    <Dialog open={!!admin} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Super Admin</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Email" value={admin?.email || ''} disabled fullWidth />
            <TextField label="Full name" fullWidth {...register('fullName')} error={!!errors.fullName} helperText={errors.fullName?.message} />
            <FormControlLabel control={<Switch {...register('isActive')} />} label="Active" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
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
    <Dialog open={!!admin} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reset password for {admin?.fullName}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="New password"
            type="password"
            fullWidth
            autoFocus
            {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="warning" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}