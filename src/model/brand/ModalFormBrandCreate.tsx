"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";

interface ModalFormBrandCreateProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    logoFile?: File;
    website: string;
    originCountry: string;
    year: string;
    description: string;
  }) => void;
}

const countries = [
  { value: "VN", label: "Việt Nam" },
  { value: "US", label: "Mỹ" },
  { value: "JP", label: "Nhật Bản" },
  { value: "KR", label: "Hàn Quốc" },
];

const ModalFormBrandCreate = ({
  open,
  onClose,
  onSubmit,
}: ModalFormBrandCreateProps) => {
  const [formData, setFormData] = useState({
    name: "",
    logoFile: undefined as File | undefined,
    website: "",
    originCountry: "VN",
    year: "",
    description: "",
  });
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        logoFile: undefined,
        website: "",
        originCountry: "VN",
        year: "",
        description: "",
      });
      setPreview("");
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const handleFile = (file: File) => {
    setFormData({ ...formData, logoFile: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      disableScrollLock={true}
    >
      <DialogTitle
        sx={{ borderBottom: "1px solid #eee", py: 2, fontWeight: 600 }}
      >
        Thêm thương hiệu mới
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Tên thương hiệu *
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Nhập tên thương hiệu"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Năm thành lập *
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="VD: 2010"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Website
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Quốc gia xuất xứ
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={formData.originCountry}
            onChange={(e) =>
              setFormData({ ...formData, originCountry: e.target.value })
            }
            SelectProps={{
              MenuProps: {
                disableScrollLock: true,
              },
            }}
          >
            {countries.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                {country.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Mô tả thương hiệu
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Mô tả ngắn về thương hiệu"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Logo thương hiệu *
          </Typography>
          <Box
            sx={{
              border: "1px dashed #ddd",
              borderRadius: "8px",
              p: 2,
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={openFileDialog}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <CloudUploadIcon fontSize="large" />
            <Typography variant="body2" mt={1}>
              Kéo & thả hoặc nhấn để tải ảnh lên
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview && (
              <Box mt={2}>
                <Image
                  src={preview}
                  alt="Logo preview"
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
      <DialogActions sx={{ borderTop: "1px solid #eee", px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: "#666" }}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.logoFile || !formData.year}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFormBrandCreate;
