// src/features/admin/products/components/steps/Step1BasicInfo.tsx
"use client";
import { useState } from "react";
import {
  Box, Button, Divider, MenuItem, TextField, Typography,
  ToggleButton, ToggleButtonGroup, Paper, Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import BuildIcon from "@mui/icons-material/Build";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import CategoryIcon from "@mui/icons-material/Category";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { Catalog } from "../../queries";
import type { Product, ProductType } from "../../types";

type Mode = "create" | "update";

// ─── Định nghĩa loại sản phẩm ─────────────────────────────────────────────

const PRODUCT_TYPES: {
  value: ProductType;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    value: "MACHINE",
    label: "Máy móc / Thiết bị",
    icon: <BuildIcon />,
    desc: "Máy 2 thì, máy nông nghiệp, thiết bị công nghiệp…",
  },
  {
    value: "CLOTHING",
    label: "Quần áo / Trang phục",
    icon: <CheckroomIcon />,
    desc: "Áo, quần, đồng phục — quản lý size & màu qua biến thể",
  },
  {
    value: "ACCESSORY",
    label: "Phụ kiện",
    icon: <CategoryIcon />,
    desc: "Phụ tùng, dụng cụ, đồ đi kèm…",
  },
  {
    value: "OTHER",
    label: "Sản phẩm khác",
    icon: <HelpOutlineIcon />,
    desc: "Các mặt hàng khác không thuộc nhóm trên",
  },
];

const ORIGINS = [
  "Việt Nam", "Nhật Bản", "Hàn Quốc", "Trung Quốc",
  "Hoa Kỳ", "Pháp", "Đức", "Anh", "Úc", "Canada",
];

// ─── Component ────────────────────────────────────────────────────────────

export default function Step1BasicInfo({
  mode,
  formData,
  onChange,
  onSubmit,
}: {
  mode: Mode;
  formData: Product;
  onChange: (k: keyof Product, v: any) => void;
  onSubmit: () => Promise<void>;
}) {
  const categories = Catalog.useCategories();
  const brands = Catalog.useBrands();
  const [errors, setErrors] = useState<string[]>([]);
  const [alert, setAlert] = useState({
    open: false, message: "", type: "error" as "error" | "success",
  });

  const hasError = (label: string) =>
    errors.some((m) => m.toLowerCase().includes(label.toLowerCase()));

  const handleClick = async () => {
    try {
      await onSubmit();
    } catch (e: any) {
      const msg = String(e.message || e);
      setErrors([msg]);
      setAlert({ open: true, message: msg || "Vui lòng kiểm tra lại các trường.", type: "error" });
    }
  };

  const currentType: ProductType = formData.productType ?? "MACHINE";
  const isMachine = currentType === "MACHINE";
  const isClothing = currentType === "CLOTHING";

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Typography variant="h6" fontWeight={700}>
        Bước 1: Thông tin cơ bản{mode === "update" ? " (Cập nhật)" : ""}
      </Typography>

      {/* ── Chọn loại sản phẩm ─────────────────────────────────────── */}
      <Box>
        <Typography variant="body2" fontWeight={600} color="text.secondary" mb={1.5}>
          Loại sản phẩm <span style={{ color: "red" }}>*</span>
        </Typography>
        <Grid container spacing={2}>
          {PRODUCT_TYPES.map((t) => {
            const selected = currentType === t.value;
            return (
              <Grid key={t.value} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  onClick={() => onChange("productType", t.value as ProductType)}
                  sx={{
                    p: 2, borderRadius: 2, cursor: "pointer",
                    border: selected ? "2px solid #f25c05" : "1.5px solid",
                    borderColor: selected ? "#f25c05" : "divider",
                    bgcolor: selected ? "#fff8f0" : "background.paper",
                    transition: "all 0.15s",
                    "&:hover": { borderColor: "#f25c05", bgcolor: "#fff8f0" },
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    <Box sx={{ color: selected ? "#f25c05" : "text.secondary", display: "flex" }}>
                      {t.icon}
                    </Box>
                    <Typography fontWeight={selected ? 700 : 500} color={selected ? "#f25c05" : "text.primary"}>
                      {t.label}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                    {t.desc}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Divider />

      {/* ── Thông tin chung ─────────────────────────────────────────── */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Tên sản phẩm"
            fullWidth required
            value={formData.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            error={hasError("tên sản phẩm")}
            placeholder={isMachine ? "VD: Máy cưa xích 2 thì Husqvarna 445" : "VD: Áo thun polo nam"}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select label="Xuất xứ" fullWidth required
            value={formData.origin || ""}
            onChange={(e) => onChange("origin", e.target.value)}
          >
            {ORIGINS.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select label="Danh mục" fullWidth required
            value={formData.categoryId || ""}
            onChange={(e) => onChange("categoryId", Number(e.target.value))}
            error={hasError("danh mục") || hasError("category")}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select label="Thương hiệu" fullWidth required
            value={formData.brandId || ""}
            onChange={(e) => onChange("brandId", Number(e.target.value))}
            error={hasError("thương hiệu") || hasError("brand")}
          >
            {brands.map((b) => (
              <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Mô tả sản phẩm" fullWidth multiline rows={4} required
            value={formData.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder={
              isMachine
                ? "Mô tả chi tiết về công năng, ứng dụng, ưu điểm của máy..."
                : "Mô tả chất liệu, kiểu dáng, phong cách, phù hợp với ai..."
            }
          />
        </Grid>
      </Grid>

      {/* ── Chất liệu (chỉ Quần áo / Phụ kiện) ──────────────────────── */}
      {(isClothing || currentType === "ACCESSORY") && (
        <>
          <Divider />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1}>
              Thông tin chất liệu
            </Typography>
            <Typography variant="caption" color="text.disabled" display="block" mb={2}>
              Kích cỡ và màu sắc sẽ được thiết lập ở bước Biến thể để quản lý tồn kho riêng từng size/màu.
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Chất liệu"
                  fullWidth
                  placeholder="VD: Cotton 100%, Polyester, Vải kaki…"
                  value={formData.material || ""}
                  onChange={(e) => onChange("material", e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleClick} sx={{ px: 4, py: 1.5 }}>
          Tiếp theo
        </Button>
      </Box>

      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
}
