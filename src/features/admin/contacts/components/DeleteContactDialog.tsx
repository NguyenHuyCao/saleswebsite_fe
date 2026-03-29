"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface Props {
  open: boolean;
  contactName: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteContactDialog({
  open,
  contactName,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc muốn xoá liên hệ từ <strong>{contactName}</strong>?
          Hành động này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" disabled={loading}>
          Huỷ
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? "Đang xoá..." : "Xoá"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
