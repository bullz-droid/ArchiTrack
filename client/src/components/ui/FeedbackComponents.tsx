import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export const LoadingSpinner = () => (
  <Stack alignItems="center" justifyContent="center" sx={{ py: 8, gap: 2 }}>
    <CircularProgress />
    <Typography variant="body1">Loading content, please wait...</Typography>
  </Stack>
)

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <Stack alignItems="center" justifyContent="center" sx={{ textAlign: 'center', py: 10, color: 'text.secondary', gap: 1 }}>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    <Typography>{description}</Typography>
  </Stack>
)

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({ open, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} aria-labelledby="confirm-dialog-title">
    <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>{cancelText}</Button>
      <Button onClick={onConfirm} variant="contained" color="secondary">
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
)

interface ActionBannerProps {
  title: string
  description: string
  action: ReactNode
}

export const ActionBanner = ({ title, description, action }: ActionBannerProps) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={3} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
    <Stack>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Stack>
    {action}
  </Stack>
)
