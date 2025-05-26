"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface ConfirmDeleteProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteCategory = ({
  open,
  onConfirm,
  onCancel,
}: ConfirmDeleteProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Bạn có chắc muốn xoá danh mục này?</DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>Hủy</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteCategory;
