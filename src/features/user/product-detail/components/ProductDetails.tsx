"use client";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Alert,
  AlertTitle,
  LinearProgress,
  Grid,
} from "@mui/material";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { selectIsProductInWishlist } from "@/redux/selectors/wishlistSelectors";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { useToast } from "@/lib/toast/ToastContext";
import { mutate } from "swr";
import { CART_COUNT_KEY, WISHLIST_COUNT_KEY } from "@/constants/apiKeys";
import { http } from "@/lib/api/http";
import { useSocket } from "@/lib/socket/SocketContext";
import type { Category, Product, ProductVariant } from "@/features/user/products/types";

interface Props {
  product: Product;
  category: Category | null;
}

export default function ProductDetails({ product, category }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const qc = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isFavorite = useSelector((state: AppState) =>
    selectIsProductInWishlist(product.id)(state),
  );

  const { showToast } = useToast();
  const { refresh: refreshNotifications } = useSocket();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const isMachine = !product.productType || product.productType === "MACHINE";
  const hasVariants = !isMachine && (product.variants?.length ?? 0) > 0;

  // Derive stock from selected variant (if any) or product level
  const activeVariants = product.variants?.filter((v) => v.active) ?? [];
  const effectiveStock = selectedVariant
    ? selectedVariant.stockQuantity
    : hasVariants
    ? (activeVariants.reduce((s, v) => s + v.stockQuantity, 0))
    : (product.stockQuantity ?? 0);

  const warranty = product.warrantyMonths ?? 0;
  const totalStock = product.totalStock ?? 0;
  const inStock = hasVariants
    ? (selectedVariant ? selectedVariant.stockQuantity > 0 : activeVariants.some((v) => v.stockQuantity > 0))
    : (product.inStock && effectiveStock > 0);

  // Unique sizes and colors from active variants
  const uniqueSizes = [...new Set(activeVariants.map((v) => v.size).filter(Boolean))] as string[];
  const uniqueColors = [...new Set(activeVariants.map((v) => v.color).filter(Boolean))] as string[];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Find matching variant when size/color changes
  useEffect(() => {
    if (!hasVariants) return;
    if (!selectedSize && !selectedColor) { setSelectedVariant(null); return; }
    const match = activeVariants.find(
      (v) =>
        (!selectedSize || v.size === selectedSize) &&
        (!selectedColor || v.color === selectedColor)
    ) ?? null;
    setSelectedVariant(match);
  }, [selectedSize, selectedColor, hasVariants]);

  // Auto-select first size/color if only one option
  useEffect(() => {
    if (!hasVariants) return;
    if (uniqueSizes.length === 1) setSelectedSize(uniqueSizes[0]);
    if (uniqueColors.length === 1) setSelectedColor(uniqueColors[0]);
  }, [hasVariants, uniqueSizes.length, uniqueColors.length]);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  const handleAddToCart = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      return setSnackbar({ open: true, type: "error", message: "Bạn cần đăng nhập để thêm vào giỏ hàng." });
    }

    // If non-machine with variants but no variant selected, warn
    if (hasVariants && !selectedVariant) {
      return setSnackbar({ open: true, type: "error", message: "Vui lòng chọn kích cỡ / màu sắc trước khi thêm vào giỏ." });
    }

    try {
      await http.post("/api/v1/carts", {
        quantity,
        productId: product.id,
        variantId: selectedVariant?.id ?? undefined,
      });
      mutate(CART_COUNT_KEY, undefined, { revalidate: true });
      qc.invalidateQueries({ queryKey: ["cart"] });
      refreshNotifications();
      setQuantity(1);
      showToast(`Đã thêm ${quantity > 1 ? `${quantity}x ` : ""}${product.name} vào giỏ hàng!`, "success", "Thêm vào giỏ hàng");
    } catch (e: any) {
      setSnackbar({ open: true, type: "error", message: e?.message || "Thêm vào giỏ hàng thất bại." });
    }
  };

  const toggleFavorite = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      return setSnackbar({ open: true, type: "error", message: "Bạn cần đăng nhập để yêu thích sản phẩm." });
    }
    try {
      const formData = new FormData();
      formData.append("productId", String(product.id));
      await http.post("/api/v1/wishlist", formData, { headers: { "Content-Type": "multipart/form-data" } });
      dispatch(fetchWishlist());
      mutate(WISHLIST_COUNT_KEY, undefined, { revalidate: true });
      if (isFavorite) {
        showToast(`Đã xóa ${product.name} khỏi yêu thích.`, "info", "Yêu thích");
      } else {
        showToast(`Đã thêm ${product.name} vào yêu thích!`, "success", "Yêu thích");
      }
    } catch (e: any) {
      setSnackbar({ open: true, type: "error", message: e?.message || "Lỗi cập nhật yêu thích." });
    }
  };

  const progressPercent = totalStock > 0 ? Math.round(((totalStock - effectiveStock) / totalStock) * 100) : 0;
  const soldCount = totalStock - effectiveStock;

  const handleQuantityChange = (value: number) => {
    if (!Number.isNaN(value) && value >= 1 && value <= effectiveStock) setQuantity(value);
  };

  // Check if a color is available for currently selected size
  const isColorAvailable = (color: string) => {
    if (!selectedSize) return activeVariants.some((v) => v.color === color && v.stockQuantity > 0);
    return activeVariants.some((v) => v.size === selectedSize && v.color === color && v.stockQuantity > 0);
  };

  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return activeVariants.some((v) => v.size === size && v.stockQuantity > 0);
    return activeVariants.some((v) => v.size === size && v.color === selectedColor && v.stockQuantity > 0);
  };

  return (
    <Box>
      {/* Product Name */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ wordBreak: "break-word" }}>
        {product.name}
      </Typography>

      {/* Category & Tags */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Chip label={category?.name || "Không rõ"} size="small" sx={{ bgcolor: "#f25c05", color: "#fff" }} />
        {product.status?.map((tag, idx) => (
          <Chip key={idx} label={tag} size="small" sx={{ bgcolor: tag === "Mới" ? "#4caf50" : "#ffb700", color: "#fff" }} />
        ))}
      </Stack>

      {/* Basic Specs (MACHINE only) */}
      {isMachine && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          Loại: {product.fuelType || "--"} | Xuất xứ: {product.origin || "--"} | Công suất: {product.power || "--"}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Price Section */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="error.main">
          {(() => {
            const displayPrice = selectedVariant?.priceOverride ?? product.price;
            return displayPrice > 0 ? `${displayPrice.toLocaleString()}₫` : "Liên hệ báo giá";
          })()}
        </Typography>
        {product.sale && product.originalPrice > product.price && (
          <Typography variant="body1" sx={{ textDecoration: "line-through", color: "#999" }}>
            {product.originalPrice.toLocaleString()}₫
          </Typography>
        )}
      </Box>

      {/* Variant Selector (non-machine with variants) */}
      {hasVariants && (
        <Box mb={2}>
          {uniqueSizes.length > 0 && (
            <Box mb={1.5}>
              <Typography variant="body2" fontWeight={600} mb={0.5}>
                Kích cỡ: {selectedSize && <span style={{ color: "#f25c05" }}>{selectedSize}</span>}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {uniqueSizes.map((size) => {
                  const available = isSizeAvailable(size);
                  return (
                    <Chip
                      key={size}
                      label={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      variant={selectedSize === size ? "filled" : "outlined"}
                      color={selectedSize === size ? "warning" : "default"}
                      disabled={!available}
                      sx={{ cursor: available ? "pointer" : "not-allowed", opacity: available ? 1 : 0.4 }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
          {uniqueColors.length > 0 && (
            <Box mb={1.5}>
              <Typography variant="body2" fontWeight={600} mb={0.5}>
                Màu sắc: {selectedColor && <span style={{ color: "#f25c05" }}>{selectedColor}</span>}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {uniqueColors.map((color) => {
                  const available = isColorAvailable(color);
                  return (
                    <Chip
                      key={color}
                      label={color}
                      onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                      variant={selectedColor === color ? "filled" : "outlined"}
                      color={selectedColor === color ? "warning" : "default"}
                      disabled={!available}
                      sx={{ cursor: available ? "pointer" : "not-allowed", opacity: available ? 1 : 0.4 }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
          {(selectedSize || selectedColor) && !selectedVariant && (
            <Typography variant="body2" color="error">
              Không có biến thể phù hợp với lựa chọn này.
            </Typography>
          )}
        </Box>
      )}

      {/* Stock Status */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Chip
          icon={<Truck size={16} />}
          label={inStock ? `Còn ${selectedVariant ? selectedVariant.stockQuantity : effectiveStock} sản phẩm` : "Hết hàng"}
          color={inStock ? "success" : "error"}
          size="small"
        />
        <Chip icon={<Shield size={16} />} label={`Bảo hành: ${warranty > 0 ? `${warranty} tháng` : "Không có"}`} size="small" />
        <Chip icon={<RotateCcw size={16} />} label="Đổi trả 7 ngày" size="small" />
      </Stack>

      {/* Specifications Grid (MACHINE only) */}
      {isMachine && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
              <b>Nhiên liệu:</b> {product.fuelType || "--"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
              <b>Động cơ:</b> {product.engineType || "--"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
              <b>Dung tích:</b> {product.tankCapacity ?? 0}L
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
              <b>Kích thước:</b> {product.dimensions || "--"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
              <b>Trọng lượng:</b> {product.weight ?? 0}kg
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
              <b>Xuất xứ:</b> {product.origin || "--"}
            </Typography>
          </Grid>
        </Grid>
      )}

      {/* Sales Progress */}
      {totalStock > 0 && (
        <Box sx={{ bgcolor: "#fff8e1", p: 1.5, borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2">Đã bán: {soldCount}</Typography>
            <Typography variant="body2">Còn lại: {effectiveStock}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 8, borderRadius: 4, bgcolor: "#ffe0b2",
              "& .MuiLinearProgress-bar": { bgcolor: "#f25c05" },
            }}
          />
        </Box>
      )}

      {/* Quantity Selector & Add to Cart */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden", height: 44 }}
        >
          <IconButton size="small" sx={{ borderRadius: 0, px: 1.5 }} disabled={quantity <= 1} onClick={() => handleQuantityChange(quantity - 1)}>
            <Minus size={18} />
          </IconButton>
          <TextField
            size="small"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleQuantityChange(Number.isNaN(val) ? 1 : val);
            }}
            sx={{ width: 60, input: { textAlign: "center", py: 1.2 }, "& fieldset": { border: "none" } }}
          />
          <IconButton
            size="small"
            sx={{ borderRadius: 0, px: 1.5 }}
            disabled={quantity >= effectiveStock}
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus size={18} />
          </IconButton>
        </Stack>

        <Tooltip title={!inStock ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}>
          <span style={{ flex: 1 }}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              startIcon={<ShoppingCart size={18} />}
              sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: "0.95rem", textTransform: "none" }}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {inStock ? "Thêm vào giỏ" : "Hết hàng"}
            </Button>
          </span>
        </Tooltip>

        <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}>
          <IconButton
            onClick={toggleFavorite}
            sx={{
              border: "1px solid",
              borderColor: isFavorite ? "#f25c05" : "#e0e0e0",
              width: 44, height: 44,
              bgcolor: isFavorite ? "#fff8f0" : "transparent",
              "&:hover": { bgcolor: "#fff8f0" },
            }}
          >
            <Heart fill={isFavorite ? "#f25c05" : "none"} color={isFavorite ? "#f25c05" : "#999"} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Bulk Price Notice */}
      <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
        <AlertTitle sx={{ fontWeight: 600 }}>💼 Giá sỉ cho đơn hàng từ 5 sản phẩm</AlertTitle>
        Liên hệ hotline <strong>1900 6750</strong> để được báo giá tốt nhất.
      </Alert>

      <GlobalSnackbar
        type={snackbar.type}
        message={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
