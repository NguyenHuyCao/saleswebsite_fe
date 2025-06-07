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
  onSubmit: (name: string, imageFile?: File) => void;
}

const ModalCreateCategory = ({
  open,
  onClose,
  onSubmit,
}: ModalCreateCategoryProps) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setName("");
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
    onSubmit(name, imageFile || undefined);
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

        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Logo danh mục
          </Typography>
          <Box
            sx={{
              border: "1px dashed #ddd",
              borderRadius: "8px",
              p: 2,
              textAlign: "center",
            }}
          >
            <Box component="label">
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                component="span"
              >
                Tải lên ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
            {preview && (
              <Box mt={2}>
                <Image
                  src={preview}
                  alt="Xem trước"
                  width={120}
                  height={120}
                  style={{
                    objectFit: "contain",
                    border: "1px solid #eee",
                    borderRadius: 4,
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
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCreateCategory;
