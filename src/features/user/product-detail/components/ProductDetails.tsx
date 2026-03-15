"use client";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
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
  Clock,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { selectIsProductInWishlist } from "@/redux/selectors/wishlistSelectors";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { mutate } from "swr";
import { CART_COUNT_KEY, WISHLIST_COUNT_KEY } from "@/constants/apiKeys";
import { http } from "@/lib/api/http";

interface Props {
  product: Product;
  category: Category | null;
}

export default function ProductDetails({ product, category }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isFavorite = useSelector((state: AppState) =>
    selectIsProductInWishlist(product.id)(state),
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const warranty = product.warrantyMonths ?? 0;
  const stockQty = product.stockQuantity ?? 0;
  const totalStock = product.totalStock ?? 0;
  const inStock = product.inStock && stockQty > 0;

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleAddToCart = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      return setSnackbar({
        open: true,
        type: "error",
        message: "Bạn cần đăng nhập để thêm vào giỏ hàng.",
      });
    }

    try {
      await http.post("/api/v1/carts", { quantity, productId: product.id });
      mutate(CART_COUNT_KEY, undefined, { revalidate: true });
      setQuantity(1);
      setSnackbar({
        open: true,
        type: "success",
        message: "Đã thêm vào giỏ hàng!",
      });
    } catch (e: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: e?.message || "Thêm vào giỏ hàng thất bại.",
      });
    }
  };

  const toggleFavorite = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      return setSnackbar({
        open: true,
        type: "error",
        message: "Bạn cần đăng nhập để yêu thích sản phẩm.",
      });
    }
    try {
      const formData = new FormData();
      formData.append("productId", String(product.id));
      await http.post("/api/v1/wishlist", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchWishlist());
      mutate(WISHLIST_COUNT_KEY, undefined, { revalidate: true });
    } catch (e: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: e?.message || "Lỗi cập nhật yêu thích.",
      });
    }
  };

  const progressPercent =
    totalStock > 0
      ? Math.round(((totalStock - stockQty) / totalStock) * 100)
      : 0;

  const soldCount = totalStock - stockQty;

  const handleQuantityChange = (value: number) => {
    if (!Number.isNaN(value) && value >= 1 && value <= stockQty) {
      setQuantity(value);
    }
  };

  return (
    <Box>
      {/* Product Name */}
      <Typography
        variant="h5"
        fontWeight={700}
        gutterBottom
        sx={{ wordBreak: "break-word" }}
      >
        {product.name}
      </Typography>

      {/* Category & Tags */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
      >
        <Chip
          label={category?.name || "Không rõ"}
          size="small"
          sx={{ bgcolor: "#f25c05", color: "#fff" }}
        />
        {product.status?.map((tag, idx) => (
          <Chip
            key={idx}
            label={tag}
            size="small"
            sx={{
              bgcolor: tag === "Mới" ? "#4caf50" : "#ffb700",
              color: "#fff",
            }}
          />
        ))}
      </Stack>

      {/* Basic Specs */}
      <Typography variant="body2" color="text.secondary" mb={2}>
        Loại: {product.fuelType || "--"} | Xuất xứ: {product.origin || "--"} |
        Công suất: {product.power || "--"}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Price Section */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="error.main">
          {product.price > 0
            ? `${product.price.toLocaleString()}₫`
            : "Liên hệ báo giá"}
        </Typography>
        {product.sale && product.originalPrice > product.price && (
          <Typography
            variant="body1"
            sx={{ textDecoration: "line-through", color: "#999" }}
          >
            {product.originalPrice.toLocaleString()}₫
          </Typography>
        )}
      </Box>

      {/* Stock Status */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
      >
        <Chip
          icon={<Truck size={16} />}
          label={inStock ? `Còn ${stockQty} sản phẩm` : "Hết hàng"}
          color={inStock ? "success" : "error"}
          size="small"
        />
        <Chip
          icon={<Shield size={16} />}
          label={`Bảo hành: ${warranty > 0 ? `${warranty} tháng` : "Không có"}`}
          size="small"
        />
        <Chip
          icon={<RotateCcw size={16} />}
          label="Đổi trả 7 ngày"
          size="small"
        />
      </Stack>

      {/* Specifications Grid */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6 }}>
          <Typography
            variant="body2"
            sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}
          >
            <b>Nhiên liệu:</b> {product.fuelType || "--"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography
            variant="body2"
            sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}
          >
            <b>Động cơ:</b> {product.engineType || "--"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography
            variant="body2"
            sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}
          >
            <b>Dung tích:</b> {product.tankCapacity ?? 0}L
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography
            variant="body2"
            sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}
          >
            <b>Kích thước:</b> {product.dimensions || "--"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography
            variant="body2"
            sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}
          >
            <b>Trọng lượng:</b> {product.weight ?? 0}kg
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography
            variant="body2"
            sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}
          >
            <b>Xuất xứ:</b> {product.origin || "--"}
          </Typography>
        </Grid>
      </Grid>

      {/* Sales Progress */}
      {totalStock > 0 && (
        <Box sx={{ bgcolor: "#fff8e1", p: 1.5, borderRadius: 2, mb: 2 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="body2">Đã bán: {soldCount}</Typography>
            <Typography variant="body2">Còn lại: {stockQty}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#ffe0b2",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#f25c05",
              },
            }}
          />
        </Box>
      )}

      {/* Quantity Selector & Add to Cart */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            overflow: "hidden",
            height: 44,
          }}
        >
          <IconButton
            size="small"
            sx={{ borderRadius: 0, px: 1.5 }}
            disabled={quantity <= 1}
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            <Minus size={18} />
          </IconButton>
          <TextField
            size="small"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleQuantityChange(Number.isNaN(val) ? 1 : val);
            }}
            sx={{
              width: 60,
              input: { textAlign: "center", py: 1.2 },
              "& fieldset": { border: "none" },
            }}
          />
          <IconButton
            size="small"
            sx={{ borderRadius: 0, px: 1.5 }}
            disabled={quantity >= stockQty}
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus size={18} />
          </IconButton>
        </Stack>

        <Tooltip
          title={!inStock ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}
        >
          <span style={{ flex: 1 }}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              startIcon={<ShoppingCart size={18} />}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
              }}
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
              width: 44,
              height: 44,
              bgcolor: isFavorite ? "#fff8f0" : "transparent",
              "&:hover": { bgcolor: "#fff8f0" },
            }}
          >
            <Heart
              fill={isFavorite ? "#f25c05" : "none"}
              color={isFavorite ? "#f25c05" : "#999"}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Bulk Price Notice */}
      <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
        <AlertTitle sx={{ fontWeight: 600 }}>
          💼 Giá sỉ cho đơn hàng từ 5 sản phẩm
        </AlertTitle>
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
