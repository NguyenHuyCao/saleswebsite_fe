// src/features/admin/products/components/ProductDetail.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import { useProduct } from "../queries";
import type { ProductType } from "../types";

/* ── Helpers ────────────────────────────────────────────────────── */

const TYPE_META: Record<ProductType, { label: string; color: "primary" | "secondary" | "warning" | "default" }> = {
  MACHINE:   { label: "Máy móc / Thiết bị", color: "primary" },
  CLOTHING:  { label: "Quần áo / Trang phục", color: "secondary" },
  ACCESSORY: { label: "Phụ kiện",             color: "warning" },
  OTHER:     { label: "Sản phẩm khác",         color: "default" },
};

function fmtVND(n?: number | null) {
  if (n == null) return "—";
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function fmtDate(s?: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleString("vi-VN");
}

/* ── InfoItem: label + value row ────────────────────────────────── */
function InfoItem({
  label,
  value,
  xs = 12,
  sm = 6,
  md = 4,
}: {
  label: string;
  value?: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
}) {
  return (
    <Grid size={{ xs, sm, md }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={700}
        sx={{ textTransform: "uppercase", letterSpacing: 0.6, display: "block", mb: 0.4 }}
      >
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500} component="div">
        {value ?? "—"}
      </Typography>
    </Grid>
  );
}

/* ── SectionCard ─────────────────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        sx={{ pb: 0 }}
      />
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function ProductDetail() {
  const router = useRouter();
  const search = useSearchParams();
  const slug = search.get("productSlug");
  const { data: product, loading, error } = useProduct(slug);

  if (loading)
    return (
      <Box p={6}>
        <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
      </Box>
    );

  if (error || !product)
    return (
      <Box p={6}>
        <Typography color="error">{error || "Không tìm thấy sản phẩm"}</Typography>
      </Box>
    );

  const typeMeta = TYPE_META[product.productType ?? "MACHINE"];
  const isMachine = !product.productType || product.productType === "MACHINE";

  const detailImgs = [
    product.imageDetail1,
    product.imageDetail2,
    product.imageDetail3,
  ].filter((v): v is string => typeof v === "string" && v.length > 0);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const margin =
    product.price && product.costPrice && product.price > 0
      ? (((product.price - product.costPrice) / product.price) * 100).toFixed(1)
      : null;

  return (
    <Box>
      {/* ── Page header ── */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/admin/products")}
          >
            Quay lại
          </Button>
          <Typography variant="h5" fontWeight={700}>
            {product.name}
          </Typography>
          <Chip
            label={typeMeta.label}
            color={typeMeta.color}
            size="small"
            variant="outlined"
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
        <Button
          variant="contained"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => router.push(`/admin/products/update?productSlug=${product.slug}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>

      {/* ── Section 1: Hình ảnh ── */}
      <SectionCard title="Hình ảnh sản phẩm">
        <Box display="flex" gap={3} flexWrap="wrap" alignItems="flex-start">
          {/* Avatar */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.6, mb: 1, display: "block" }}>
              Ảnh đại diện
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: 160,
                height: 160,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Image
                src={(product.imageAvt as string) || "/images/favicon.png"}
                alt="Ảnh đại diện"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Box>

          {/* Detail images */}
          {detailImgs.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.6, mb: 1, display: "block" }}>
                Ảnh chi tiết
              </Typography>
              <Box display="flex" gap={1.5} flexWrap="wrap">
                {detailImgs.map((img, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 1.5,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Chi tiết ${i + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </SectionCard>

      {/* ── Section 2: Thông tin cơ bản ── */}
      <SectionCard title="Thông tin cơ bản">
        <Grid container spacing={3}>
          <InfoItem label="ID sản phẩm"  value={product.id}      md={3} />
          <InfoItem label="Slug"          value={<Typography variant="body2" fontFamily="monospace" fontSize={13}>{product.slug}</Typography>} md={5} />
          <InfoItem label="Loại sản phẩm" value={typeMeta.label} md={4} />
          <InfoItem label="Tên sản phẩm" value={product.name}    md={6} sm={12} />
          <InfoItem label="Thương hiệu"  value={product.brandName}   md={3} />
          <InfoItem label="Danh mục"     value={product.categoryName} md={3} />
          <InfoItem label="Xuất xứ"      value={product.origin}  md={3} />
          <InfoItem
            label="Đánh giá"
            value={
              product.rating && product.rating > 0
                ? <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="body1" fontWeight={600} color="warning.main">★</Typography>
                    <Typography variant="body1" fontWeight={500}>{product.rating.toFixed(1)}</Typography>
                  </Box>
                : "Chưa có đánh giá"
            }
            md={3}
          />
          <InfoItem label="Ngày tạo"     value={fmtDate(product.createdAt)} md={4} />
          <InfoItem label="Cập nhật lần cuối" value={fmtDate(product.updatedAt)} md={4} />
          <InfoItem
            label="Trạng thái"
            value={
              <Chip
                label={product.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                color={product.active ? "success" : "default"}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            }
            md={4}
          />
        </Grid>
      </SectionCard>

      {/* ── Section 3: Giá & Tồn kho ── */}
      <SectionCard title="Giá & Tồn kho">
        <Grid container spacing={3}>
          <InfoItem
            label="Giá bán"
            value={<Typography variant="body1" fontWeight={700} color="primary.main">{fmtVND(product.price)}</Typography>}
            md={3}
          />
          <InfoItem
            label="Giá gốc (nhập)"
            value={fmtVND(product.costPrice)}
            md={3}
          />
          <InfoItem
            label="Biên lợi nhuận"
            value={
              margin != null
                ? <Typography variant="body1" fontWeight={600} color="success.main">{margin}%</Typography>
                : "—"
            }
            md={3}
          />
          <InfoItem label="Bảo hành" value={product.warrantyMonths ? `${product.warrantyMonths} tháng` : "—"} md={3} />
          <InfoItem
            label="Tồn kho (tổng)"
            value={
              <Typography
                variant="body1"
                fontWeight={700}
                color={
                  (product.totalStock ?? product.stockQuantity ?? 0) <= 0
                    ? "error.main"
                    : (product.totalStock ?? product.stockQuantity ?? 0) <= 9
                    ? "warning.main"
                    : "text.primary"
                }
              >
                {product.totalStock ?? product.stockQuantity ?? 0}
              </Typography>
            }
            md={3}
          />
          <InfoItem label="Tồn kho (mặc định)" value={product.stockQuantity ?? 0} md={3} />
        </Grid>
      </SectionCard>

      {/* ── Section 4a: Thông số kỹ thuật (MACHINE) ── */}
      {isMachine && (
        <SectionCard title="Thông số kỹ thuật">
          <Grid container spacing={3}>
            <InfoItem label="Công suất"    value={product.power}       md={3} />
            <InfoItem label="Loại động cơ" value={product.engineType}  md={3} />
            <InfoItem label="Nhiên liệu"   value={product.fuelType}    md={3} />
            <InfoItem label="Trọng lượng"  value={product.weight ? `${product.weight} g` : undefined} md={3} />
            <InfoItem label="Kích thước"   value={product.dimensions}  md={4} />
            <InfoItem label="Dung tích bình" value={product.tankCapacity ? `${product.tankCapacity} L` : undefined} md={4} />
          </Grid>
        </SectionCard>
      )}

      {/* ── Section 4b: Đặc điểm (CLOTHING / ACCESSORY / OTHER) ── */}
      {!isMachine && (
        <SectionCard title="Đặc điểm sản phẩm">
          <Grid container spacing={3}>
            <InfoItem label="Kích cỡ"   value={product.size}     md={4} />
            <InfoItem label="Màu sắc"   value={product.color}    md={4} />
            <InfoItem label="Chất liệu" value={product.material} md={4} />
          </Grid>
        </SectionCard>
      )}

      {/* ── Section 5: Biến thể sản phẩm ── */}
      {hasVariants && (
        <SectionCard title={`Biến thể sản phẩm (${product.variants!.length})`}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Kích cỡ</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Màu sắc</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Tồn kho</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Giá riêng</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.variants!.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{v.sku ?? "—"}</TableCell>
                    <TableCell>{v.size ?? "—"}</TableCell>
                    <TableCell>{v.color ?? "—"}</TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={v.stockQuantity <= 0 ? "error.main" : v.stockQuantity <= 5 ? "warning.main" : "text.primary"}
                      >
                        {v.stockQuantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {v.priceOverride != null ? (
                        <Typography variant="body2" fontWeight={600} color="primary.main">
                          {fmtVND(v.priceOverride)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.disabled">Giá chung</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={v.active ? "Hoạt động" : "Ngừng"}
                        color={v.active ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      )}

      {/* ── Section 6: Mô tả sản phẩm ── */}
      <SectionCard title="Mô tả sản phẩm">
        {product.description ? (
          <Typography
            variant="body2"
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              lineHeight: 1.8,
              color: "text.primary",
            }}
          >
            {product.description}
          </Typography>
        ) : (
          <Typography color="text.disabled">Chưa có mô tả.</Typography>
        )}
      </SectionCard>
    </Box>
  );
}
