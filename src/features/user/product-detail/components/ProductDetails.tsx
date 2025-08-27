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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { selectIsProductInWishlist } from "@/redux/selectors/wishlistSelectors";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { mutate } from "swr";
import { CART_COUNT_KEY, WISHLIST_COUNT_KEY } from "@/constants/apiKeys";
import { http } from "@/lib/api/http";
// import type { Product, Category } from "@/product/types";

interface Props {
  product: Product;
  category: Category | null;
}

export default function ProductDetails({ product, category }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isFavorite = useSelector((state: AppState) =>
    selectIsProductInWishlist(product.id)(state)
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleAddToCart = async () => {
    // Thông báo nhẹ nếu chưa đăng nhập (tránh 401 -> redirect)
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
      await http.post("/api/v1/wish_list", formData, {
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
    product.totalStock > 0
      ? Math.round(
          ((product.totalStock - product.stockQuantity) / product.totalStock) *
            100
        )
      : 0;

  const handleQuantityChange = (value: number) => {
    if (!Number.isNaN(value) && value >= 1 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  return (
    <Box component={Paper} elevation={1} p={3} borderRadius={3}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {product.name}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={1.5}>
        Thương hiệu:{" "}
        <Box component="span" color="warning.main" fontWeight={500}>
          {category?.name || "Không rõ"}
        </Box>{" "}
        | Loại: {product.fuelType || "--"} | Xuất xứ: {product.origin} | Công
        suất: {product.power}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h4" fontWeight={700} color="error.main" gutterBottom>
        {product.price > 0
          ? `${product.price.toLocaleString()}₫`
          : "Liên hệ báo giá"}
      </Typography>
      <Typography color="success.main" variant="body2" mb={2}>
        Còn hàng: {product.stockQuantity} sản phẩm
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            <b>Loại nhiên liệu:</b> {product.fuelType}
          </Typography>
          <Typography variant="body2">
            <b>Loại động cơ:</b> {product.engineType}
          </Typography>
          <Typography variant="body2">
            <b>Dung tích bình:</b> {product.tankCapacity}L
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            <b>Kích thước:</b> {product.dimensions}
          </Typography>
          <Typography variant="body2">
            <b>Trọng lượng:</b> {product.weight}g
          </Typography>
          <Typography variant="body2">
            <b>Bảo hành:</b>{" "}
            {product.warrantyMonths > 0
              ? `${product.warrantyMonths} tháng`
              : "Không có"}
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          bgcolor: "#ffc107",
          p: 1.5,
          borderRadius: 1,
          position: "relative",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 12,
            bgcolor: "white",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${progressPercent}%`,
              height: "100%",
              bgcolor: "#f44336",
              backgroundImage:
                "repeating-linear-gradient(45deg, #f44336 0, #f44336 10px, #ff9800 10px, #ff9800 20px)",
              transition: "width 0.4s ease",
              borderRadius: 6,
            }}
          />
        </Box>
        <Typography variant="body2" fontWeight={600} mt={1}>
          Đã bán {product.totalStock - product.stockQuantity}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} alignItems="center" mt={3}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            overflow: "hidden",
            height: 40,
          }}
        >
          <IconButton
            size="small"
            sx={{ borderRadius: 0 }}
            disabled={quantity <= 1}
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            <Minus size={16} />
          </IconButton>
          <TextField
            size="small"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleQuantityChange(Number.isNaN(val) ? 1 : val);
            }}
            sx={{
              width: 50,
              input: { textAlign: "center", py: 1 },
              "& fieldset": { border: "none" },
            }}
          />
          <IconButton
            size="small"
            sx={{ borderRadius: 0 }}
            disabled={quantity >= product.stockQuantity}
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus size={16} />
          </IconButton>
        </Stack>

        <Tooltip title="Thêm vào giỏ hàng">
          <Button
            variant="contained"
            color="warning"
            startIcon={<ShoppingCart size={18} />}
            sx={{ borderRadius: 3, px: 3, py: 1.5, fontWeight: 600 }}
            onClick={handleAddToCart}
          >
            Thêm vào giỏ
          </Button>
        </Tooltip>

        <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}>
          <IconButton onClick={toggleFavorite}>
            <Heart fill={isFavorite ? "#f44336" : "none"} color="#f44336" />
          </IconButton>
        </Tooltip>
      </Stack>

      <GlobalSnackbar
        type={snackbar.type}
        message={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
