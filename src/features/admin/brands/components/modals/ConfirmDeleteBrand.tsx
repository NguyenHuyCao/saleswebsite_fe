"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface ConfirmDeleteProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDeleteBrand = ({
  open,
  onClose,
  onConfirm,
}: ConfirmDeleteProps) => {
  return (
    <Dialog open={open} onClose={onClose} disableScrollLock={true}>
      <DialogTitle>Bạn có chắc muốn xoá thương hiệu này?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteBrand;
