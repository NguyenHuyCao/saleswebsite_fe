"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

interface ModalEditCategoryProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName: string;
}

const ModalEditCategory = ({
  open,
  onClose,
  onSubmit,
  initialName,
}: ModalEditCategoryProps) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) {
      setName(initialName); // Set lại khi mở modal
    }
    if (!open) {
      setName(""); // Reset khi đóng
    }
  }, [open, initialName]);

  const handleSubmit = () => {
    onSubmit(name);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Cập nhật danh mục</DialogTitle>
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
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditCategory;
