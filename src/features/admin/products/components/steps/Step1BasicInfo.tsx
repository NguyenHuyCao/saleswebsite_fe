// src/features/admin/products/components/steps/Step1BasicInfo.tsx
"use client";
import { useState } from "react";
import { Box, Button, Divider, MenuItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { Catalog } from "../../queries";
import type { Product, ProductType } from "../../types";

type Mode = "create" | "update";

const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: "MACHINE",   label: "Máy móc / Thiết bị" },
  { value: "CLOTHING",  label: "Quần áo / Trang phục" },
  { value: "ACCESSORY", label: "Phụ kiện" },
  { value: "OTHER",     label: "Sản phẩm khác" },
];

const ORIGINS = [
  "Việt Nam", "Nhật Bản", "Hàn Quốc", "Trung Quốc",
  "Hoa Kỳ", "Pháp", "Đức", "Anh", "Úc", "Canada",
];

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
  const [alert, setAlert] = useState({ open: false, message: "", type: "error" as "error" | "success" });

  const hasError = (label: string) =>
    errors.some((m) => m.toLowerCase().includes(label.toLowerCase()));

  const handleClick = async () => {
    try {
      await onSubmit();
    } catch (e: any) {
      const msg = String(e.message || e);
      setErrors([msg]);
      setAlert({ open: true, message: "Vui lòng kiểm tra lại các trường.", type: "error" });
    }
  };

  const isNonMachine = formData.productType && formData.productType !== "MACHINE";

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 1: Thông tin cơ bản {mode === "update" ? "(Cập nhật)" : ""}
      </Typography>

      <Grid container spacing={4}>
        {/* Product type — always first */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Loại sản phẩm"
            fullWidth
            value={formData.productType ?? "MACHINE"}
            onChange={(e) => onChange("productType", e.target.value as ProductType)}
          >
            {PRODUCT_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            value={formData.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            error={hasError("tên sản phẩm")}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Xuất xứ"
            fullWidth
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
            select
            label="Danh mục"
            fullWidth
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
            select
            label="Thương hiệu"
            fullWidth
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
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={formData.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </Grid>
      </Grid>

      {/* ── Clothing / Accessory / Other specific fields ── */}
      {isNonMachine && (
        <>
          <Divider />
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Thông tin chi tiết sản phẩm
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Kích cỡ (Size)"
                fullWidth
                placeholder="VD: S, M, L, XL hoặc 38, 40, 42"
                value={formData.size || ""}
                onChange={(e) => onChange("size", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Màu sắc"
                fullWidth
                placeholder="VD: Đỏ, Xanh navy, Trắng"
                value={formData.color || ""}
                onChange={(e) => onChange("color", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Chất liệu"
                fullWidth
                placeholder="VD: Cotton 100%, Polyester"
                value={formData.material || ""}
                onChange={(e) => onChange("material", e.target.value)}
              />
            </Grid>
          </Grid>
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
