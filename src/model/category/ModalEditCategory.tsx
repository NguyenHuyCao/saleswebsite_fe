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
import { useEffect, useState, ChangeEvent } from "react";

interface ModalEditCategoryProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, imageFile?: File) => void;
  initialName: string;
  initialImageUrl?: string; // full URL của ảnh hiện tại
}

const ModalEditCategory = ({
  open,
  onClose,
  onSubmit,
  initialName,
  initialImageUrl,
}: ModalEditCategoryProps) => {
  const [name, setName] = useState(initialName);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialImageUrl || null
  );

  useEffect(() => {
    if (open) {
      setName(initialName);
      setImageFile(null);
      setPreview(initialImageUrl || null);
    }
  }, [open, initialName, initialImageUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSubmit(name, imageFile || undefined);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth disableScrollLock={true}>
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

        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Hình ảnh danh mục
          </Typography>
          <Box
            sx={{
              border: "1px dashed #ddd",
              borderRadius: "8px",
              p: 2,
              textAlign: "center",
            }}
          >
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
            >
              Chọn ảnh mới
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {preview && (
              <Box mt={2}>
                <Image
                  src={preview}
                  alt="Preview"
                  width={120}
                  height={120}
                  style={{
                    objectFit: "contain",
                    borderRadius: 4,
                    border: "1px solid #eee",
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
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
