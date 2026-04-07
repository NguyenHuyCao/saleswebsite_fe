"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ModalCreateCategoryProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; imageFile?: File }) => void;
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
    onSubmit({ name, description, imageFile: imageFile || undefined });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock>
      <DialogTitle sx={{ borderBottom: "1px solid", borderColor: "divider", fontWeight: 600 }}>
        Thêm danh mục mới
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>
        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Tên danh mục *</Typography>
          <TextField
            autoFocus fullWidth size="small"
            placeholder="Nhập tên danh mục"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Mô tả</Typography>
          <TextField
            fullWidth multiline rows={3} size="small"
            placeholder="Mô tả ngắn về danh mục (không bắt buộc)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Hình ảnh danh mục</Typography>
          <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 2, p: 2, textAlign: "center" }}>
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
              Tải lên ảnh
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {preview && (
              <Box mt={1.5}>
                <Image
                  src={preview} alt="Xem trước" width={100} height={100}
                  style={{ objectFit: "contain", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 4 }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCreateCategory;
