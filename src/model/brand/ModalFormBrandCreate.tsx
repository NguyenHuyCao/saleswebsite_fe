"use client";

import { useState } from "react";
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
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import { useEffect } from "react";

interface ModalFormBrandCreateProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    logoFile?: File;
    website: string;
    originCountry: string;
  }) => void;
}

const StyledUploadButton = styled(Button)(({ theme }) => ({
  padding: "8px 16px",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

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
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!open) {
      // Reset form khi modal đóng
      setFormData({
        name: "",
        logoFile: undefined,
        website: "",
        originCountry: "VN",
      });
      setPreview("");
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logoFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          borderBottom: "1px solid #eee",
          py: 2,
          fontWeight: 600,
          fontSize: "1.2rem",
        }}
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
          >
            {countries.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                {country.label}
              </MenuItem>
            ))}
          </TextField>
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
            }}
          >
            <StyledUploadButton
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Tải lên logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </StyledUploadButton>
            {preview && (
              <Box mt={2}>
                <Image
                  src={preview}
                  alt="Logo preview"
                  width={120}
                  height={120}
                  style={{
                    objectFit: "contain",
                    borderRadius: "4px",
                    border: "1px solid #eee",
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid #eee", px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#666", borderRadius: "6px", px: 3, py: 1 }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.logoFile}
          sx={{ borderRadius: "6px", px: 3, py: 1, textTransform: "none" }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFormBrandCreate;
