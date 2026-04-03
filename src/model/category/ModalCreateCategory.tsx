"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";

interface ModalCreateCategoryProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, imageFile?: File) => void;
}

const ModalCreateCategory = ({ open, onClose, onSubmit }: ModalCreateCategoryProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setImageFile(null);
      setPreview("");
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name, description, imageFile || undefined);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
      <DialogTitle>Thêm danh mục mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên danh mục *"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Mô tả danh mục"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn về danh mục (tuỳ chọn)"
          sx={{ mt: 1.5 }}
        />

        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Ảnh đại diện *
          </Typography>
          <Box
            sx={{
              border: "1px dashed #ddd",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { borderColor: "#1976d2" },
            }}
            component="label"
          >
            <Button variant="outlined" startIcon={<CloudUploadIcon />} component="span" size="small">
              Tải lên ảnh
            </Button>
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            {preview && (
              <Box mt={1.5} display="flex" justifyContent="center">
                <Image
                  src={preview}
                  alt="Xem trước"
                  width={120}
                  height={120}
                  style={{ objectFit: "contain", border: "1px solid #eee", borderRadius: 4 }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCreateCategory;
