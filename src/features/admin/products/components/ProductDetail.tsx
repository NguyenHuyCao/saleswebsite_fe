// src/features/admin/products/components/ProductDetail.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Chip,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useProduct } from "../queries";
import type { ProductType } from "../types";

const TYPE_LABEL: Record<ProductType, string> = {
  MACHINE:   "Máy móc / Thiết bị",
  CLOTHING:  "Quần áo / Trang phục",
  ACCESSORY: "Phụ kiện",
  OTHER:     "Sản phẩm khác",
};

const ReadOnly = ({ label, value }: { label: string; value: any }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <TextField fullWidth size="small" value={value ?? "-"} InputProps={{ readOnly: true }} />
  </Grid>
);

export default function ProductDetail() {
  const theme = useTheme();
  const search = useSearchParams();
  const slug = search.get("productSlug");
  const { data: product, loading, error } = useProduct(slug);

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (error || !product)
    return <Typography color="error">{error || "Không tìm thấy sản phẩm"}</Typography>;

  const isMachine = !product.productType || product.productType === "MACHINE";

  const detailImgs = [product.imageDetail1, product.imageDetail2, product.imageDetail3]
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  return (
    <Paper sx={{ p: 6 }} elevation={4}>
      <Box display="flex" alignItems="center" gap={2} mb={4} flexWrap="wrap">
        <Typography variant="h5" fontWeight={550}>
          Thông tin sản phẩm
        </Typography>
        <Chip
          label={TYPE_LABEL[product.productType ?? "MACHINE"]}
          color={isMachine ? "primary" : "secondary"}
          variant="outlined"
          size="small"
        />
        <Chip
          label={product.active ? "Đang hoạt động" : "Ngừng hoạt động"}
          color={product.active ? "success" : "default"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
        {product.rating != null && product.rating > 0 && (
          <Chip label={`★ ${product.rating.toFixed(1)}`} color="warning" size="small" />
        )}
      </Box>

      {/* Images */}
      <Box display="flex" gap={3} mb={4} flexWrap="wrap">
        <Box sx={{ borderRadius: 2, overflow: "hidden", width: 150, height: 150, position: "relative", bgcolor: theme.palette.background.paper }}>
          <Image
            src={(product.imageAvt as string) || "/images/favicon.png"}
            alt="Ảnh đại diện"
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap">
          {detailImgs.map((img, i) => (
            <Box key={i} sx={{ borderRadius: 1, overflow: "hidden", width: 80, height: 80, border: `1px solid ${theme.palette.divider}`, position: "relative" }}>
              <Image src={img} alt={`Chi tiết ${i + 1}`} fill style={{ objectFit: "cover" }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Basic info */}
      <Grid container spacing={4}>
        <ReadOnly label="Tên sản phẩm"  value={product.name} />
        <ReadOnly label="Thương hiệu"   value={product.brandName} />
        <ReadOnly label="Danh mục"      value={product.categoryName} />
        <ReadOnly label="Xuất xứ"       value={product.origin} />
        <ReadOnly label="Giá bán"       value={`${(product.price ?? 0).toLocaleString()}₫`} />
        <ReadOnly label="Giá gốc"       value={`${(product.costPrice ?? 0).toLocaleString()}₫`} />
        <ReadOnly label="Tồn kho"       value={product.stockQuantity} />
        <ReadOnly label="Bảo hành"      value={product.warrantyMonths ? `${product.warrantyMonths} tháng` : "-"} />
      </Grid>

      {/* Machine-specific specs */}
      {isMachine && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" mb={2} fontWeight={700}>Thông số kỹ thuật</Typography>
          <Grid container spacing={4}>
            <ReadOnly label="Công suất"  value={product.power} />
            <ReadOnly label="Loại động cơ" value={product.engineType} />
            <ReadOnly label="Nhiên liệu" value={product.fuelType} />
            <ReadOnly label="Trọng lượng" value={product.weight ? `${product.weight}g` : "-"} />
            <ReadOnly label="Kích thước" value={product.dimensions} />
            <ReadOnly label="Dung tích"  value={product.tankCapacity ? `${product.tankCapacity}L` : "-"} />
          </Grid>
        </>
      )}

      {/* Clothing / Accessory specific fields */}
      {!isMachine && (product.size || product.color || product.material) && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" mb={2} fontWeight={700}>Thông tin sản phẩm</Typography>
          <Grid container spacing={4}>
            {product.size     && <ReadOnly label="Kích cỡ"   value={product.size} />}
            {product.color    && <ReadOnly label="Màu sắc"   value={product.color} />}
            {product.material && <ReadOnly label="Chất liệu" value={product.material} />}
          </Grid>
        </>
      )}

      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" mb={1.5} fontWeight={700}>Mô tả sản phẩm</Typography>
      <TextField
        fullWidth
        multiline
        minRows={5}
        value={product.description}
        InputProps={{ readOnly: true }}
      />
    </Paper>
  );
}
