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
  onSubmit: (name: string, description: string, active: boolean, imageFile?: File) => void;
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
    onSubmit(name, description, active, imageFile || undefined);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
      <DialogTitle>Cập nhật danh mục</DialogTitle>
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
            Hình ảnh danh mục
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
              Chọn ảnh mới
            </Button>
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            {preview && (
              <Box mt={1.5} display="flex" justifyContent="center">
                <Image
                  src={preview}
                  alt="Preview"
                  width={120}
                  height={120}
                  style={{ objectFit: "contain", borderRadius: 4, border: "1px solid #eee" }}
                />
              </Box>
            )}
          </Box>
        </Box>

        <Box mt={2}>
          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                color="success"
              />
            }
            label={active ? "Đang hiển thị" : "Đang ẩn"}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditCategory;
