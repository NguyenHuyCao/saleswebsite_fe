"use client";

import { useState, useEffect } from "react";
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
  { value: "DE", label: "Đức" },
  { value: "CN", label: "Trung Quốc" },
  { value: "TW", label: "Đài Loan" },
  { value: "OTHER", label: "Khác" },
];

const ModalFormBrandEdit = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: ModalEditProps) => {
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
        active: initialData.active !== false,
      });
      setPreview(
        initialData.logo?.startsWith("http")
          ? initialData.logo
          : initialData.logo
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${initialData.logo}`
          : ""
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file.name, logoFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock>
      <DialogTitle sx={{ borderBottom: "1px solid", borderColor: "divider", py: 2, fontWeight: 600, fontSize: "1.1rem" }}>
        Cập nhật thương hiệu
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Tên thương hiệu *</Typography>
          <TextField
            fullWidth size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Năm thành lập</Typography>
          <TextField
            fullWidth size="small"
            placeholder="VD: 2010"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Website</Typography>
          <TextField
            fullWidth size="small"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Quốc gia xuất xứ</Typography>
          <TextField
            select fullWidth size="small"
            value={formData.originCountry}
            onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            {countries.map((c) => (
              <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box mb={2.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Mô tả thương hiệu</Typography>
          <TextField
            fullWidth multiline rows={3} size="small"
            placeholder="Mô tả ngắn về thương hiệu"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </Box>

        <Box mb={2.5}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                color="success"
              />
            }
            label={formData.active ? "Đang hoạt động" : "Đã tắt"}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Logo thương hiệu</Typography>
          <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 2, p: 2, textAlign: "center" }}>
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
              Tải lên logo mới
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {preview && (
              <Box mt={1.5}>
                <Image
                  src={preview} alt="Logo preview" width={100} height={100}
                  style={{ objectFit: "contain", borderRadius: 4, border: "1px solid rgba(0,0,0,0.12)" }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!formData.name || !formData.originCountry}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFormBrandEdit;
