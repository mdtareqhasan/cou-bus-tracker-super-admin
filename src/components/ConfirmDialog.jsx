import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export default function ConfirmDialog({ open, title, message, onConfirm, onClose, confirmText = 'Confirm', confirmColor = 'error' }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}