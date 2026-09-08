import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

export default function ConfirmDialog({ open, title, message, onConfirm, onClose, confirmText = 'Confirm', confirmColor = 'error' }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: confirmColor === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <WarningIcon
            sx={{
              color: confirmColor === 'error' ? '#EF4444' : '#F59E0B',
              fontSize: 24,
            }}
          />
        </Box>
        <Box component="span" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          {title}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <DialogContentText sx={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#64748B',
            borderRadius: '8px',
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          sx={{
            borderRadius: '8px',
            px: 3,
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
