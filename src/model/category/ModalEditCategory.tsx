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
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import { useEffect, useState, ChangeEvent } from "react";

interface ModalEditCategoryProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; active: boolean; imageFile?: File }) => void;
  initialName: string;
  initialDescription?: string;
  initialActive?: boolean;
  initialImageUrl?: string;
}

const ModalEditCategory = ({
  open,
  onClose,
  onSubmit,
  initialName,
  initialDescription = "",
  initialActive = true,
  initialImageUrl,
}: ModalEditCategoryProps) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [active, setActive] = useState(initialActive);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription);
      setActive(initialActive);
      setImageFile(null);
      setPreview(initialImageUrl || null);
    }
  }, [open, initialName, initialDescription, initialActive, initialImageUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSubmit({ name, description, active, imageFile: imageFile || undefined });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock>
      <DialogTitle sx={{ borderBottom: "1px solid", borderColor: "divider", fontWeight: 600 }}>
        Cập nhật danh mục
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>
        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Tên danh mục *</Typography>
          <TextField
            autoFocus fullWidth size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Mô tả</Typography>
          <TextField
            fullWidth multiline rows={3} size="small"
            placeholder="Mô tả ngắn về danh mục"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box mb={2.5}>
          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                color="success"
              />
            }
            label={active ? "Đang hiển thị" : "Đã ẩn"}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Hình ảnh danh mục</Typography>
          <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 2, p: 2, textAlign: "center" }}>
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
              Chọn ảnh mới
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {preview && (
              <Box mt={1.5}>
                <Image
                  src={preview} alt="Preview" width={100} height={100}
                  style={{ objectFit: "contain", borderRadius: 4, border: "1px solid rgba(0,0,0,0.12)" }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditCategory;
