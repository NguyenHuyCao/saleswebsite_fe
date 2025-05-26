"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

interface ModalCreateCategoryProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const ModalCreateCategory = ({
  open,
  onClose,
  onSubmit,
}: ModalCreateCategoryProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) {
      setName(""); // Reset khi modal đóng
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit(name);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Thêm danh mục mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên danh mục"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCreateCategory;
