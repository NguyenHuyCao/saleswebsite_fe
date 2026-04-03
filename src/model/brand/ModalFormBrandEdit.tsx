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
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";

interface ModalEditProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    logoFile?: File;
    website: string;
    originCountry: string;
    year: string;
    description: string;
    active: boolean;
  }) => void;
  initialData?: {
    id: number;
    name: string;
    logo: string;
    website?: string | null;
    originCountry?: string | null;
    description?: string | null;
    year?: string | null;
    active?: boolean;
    createdAt: string;
    updatedAt: string | null;
  } | null;
}

const countries = [
  { value: "VN", label: "Việt Nam" },
  { value: "US", label: "Mỹ" },
  { value: "JP", label: "Nhật Bản" },
  { value: "KR", label: "Hàn Quốc" },
  { value: "CN", label: "Trung Quốc" },
  { value: "DE", label: "Đức" },
  { value: "IT", label: "Ý" },
];

const ModalFormBrandEdit = ({ open, onClose, onSubmit, initialData }: ModalEditProps) => {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    logoFile: undefined as File | undefined,
    website: "",
    originCountry: "VN",
    year: "",
    description: "",
    active: true,
  });
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        name: initialData.name || "",
        logo: initialData.logo || "",
        logoFile: undefined,
        website: initialData.website || "",
        originCountry: initialData.originCountry || "VN",
        year: initialData.year || "",
        description: initialData.description || "",
        active: initialData.active ?? true,
      });
      setPreview(
        initialData.logo?.startsWith("http")
          ? initialData.logo
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${initialData.logo}`
      );
    }
    if (!open) {
      setFormData({
        name: "",
        logo: "",
        logoFile: undefined,
        website: "",
        originCountry: "VN",
        year: "",
        description: "",
        active: true,
      });
      setPreview("");
    }
  }, [open, initialData]);

  const handleFile = (file: File) => {
    setFormData((d) => ({ ...d, logo: file.name, logoFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    onSubmit({
      name: formData.name,
      logoFile: formData.logoFile,
      website: formData.website,
      originCountry: formData.originCountry,
      year: formData.year,
      description: formData.description,
      active: formData.active,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
      <DialogTitle sx={{ borderBottom: "1px solid #eee", py: 2, fontWeight: 600 }}>
        Cập nhật thương hiệu
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>Tên thương hiệu *</Typography>
          <TextField
            fullWidth size="small"
            value={formData.name}
            onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
          />
        </Box>

        <Box mb={2.5} display="flex" gap={2}>
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Năm thành lập *</Typography>
            <TextField
              fullWidth size="small"
              placeholder="VD: 2010"
              value={formData.year}
              onChange={(e) => setFormData((d) => ({ ...d, year: e.target.value }))}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Quốc gia xuất xứ</Typography>
            <TextField
              select fullWidth size="small"
              value={formData.originCountry}
              onChange={(e) => setFormData((d) => ({ ...d, originCountry: e.target.value }))}
              slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}
            >
              {countries.map((c) => (
                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>Website</Typography>
          <TextField
            fullWidth size="small"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => setFormData((d) => ({ ...d, website: e.target.value }))}
          />
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>Mô tả thương hiệu</Typography>
          <TextField
            fullWidth multiline rows={3} size="small"
            placeholder="Mô tả ngắn về thương hiệu"
            value={formData.description}
            onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
          />
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>Logo thương hiệu</Typography>
          <Box
            sx={{
              border: "1px dashed #ddd", borderRadius: 2, p: 2, textAlign: "center", cursor: "pointer",
              "&:hover": { borderColor: "#1976d2" },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUploadIcon sx={{ color: "#999" }} />
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Kéo & thả hoặc nhấn để tải ảnh mới
            </Typography>
            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
            {preview && (
              <Box mt={1.5} display="flex" justifyContent="center">
                <Image
                  src={preview} alt="Logo preview" width={100} height={100}
                  style={{ objectFit: "contain", borderRadius: 4, border: "1px solid #eee" }}
                />
              </Box>
            )}
          </Box>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={formData.active}
              onChange={(e) => setFormData((d) => ({ ...d, active: e.target.checked }))}
              color="success"
            />
          }
          label={formData.active ? "Đang hoạt động" : "Tạm ẩn"}
        />
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid #eee", px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: "#666" }}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.year}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFormBrandEdit;
