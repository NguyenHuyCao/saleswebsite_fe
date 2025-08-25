"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Tooltip,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GlobalSnackbar from "../../components/alert/GlobalSnackbar";
import { mutate } from "swr";
import { CART_COUNT_KEY, WISHLIST_COUNT_KEY } from "@/constants/apiKeys";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import type { AppDispatch, AppState } from "@/redux/store";

type Props = {
  product: Product;
  mutateKey?: string;
};

const ProductCard = ({ product, mutateKey }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const wishlistIds = useSelector(
    (state: AppState) => new Set(state.wishlist.result.map((item) => item.id))
  );
  const isFavorite = wishlistIds.has(product.id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"favorite" | "cart" | null>(
    null
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);

  useEffect(() => {
    const checkPromotion = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promotions/product?productId=${product.id}`
        );
        const promo = await res.json();
        if (promo?.data?.discount) setDiscountPercent(promo.data.discount);
      } catch (err) {
        console.error("Lỗi khi kiểm tra khuyến mãi:", err);
      }
    };
    if (product.sale) checkPromotion();
  }, [product]);

  const requireLogin = (type: "favorite" | "cart") => {
    setActionType(type);
    setDialogOpen(true);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("accessToken");
    if (!token) return requireLogin("cart");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Đã thêm vào giỏ hàng",
          type: "success",
        });
        mutate(CART_COUNT_KEY);
      } else {
        throw new Error(result.message || "Lỗi khi thêm sản phẩm");
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Lỗi kết nối hoặc xử lý giỏ hàng",
        type: "error",
      });
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("accessToken");
    if (!token) return requireLogin("favorite");

    try {
      const formData = new FormData();
      formData.append("productId", String(product.id));
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wish_list`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Cập nhật yêu thích thất bại");

      dispatch(fetchWishlist());
      mutate(WISHLIST_COUNT_KEY);
      if (mutateKey) mutate(mutateKey);
    } catch {
      setSnackbar({
        open: true,
        message: "Lỗi khi cập nhật yêu thích",
        type: "error",
      });
    }
  };

  return (
    <>
      <Box
        onClick={() => router.push(`/product/detail?name=${product.slug}`)}
        sx={{
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": { transform: "translateY(-3px)", boxShadow: 3 },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            maxWidth: 240,
            minHeight: 420,
            borderRadius: 2,
            overflow: "hidden",
            p: 2,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: "#fff",
          }}
        >
          <Tooltip title="Thêm vào yêu thích">
            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "#fff",
                width: 30,
                height: 30,
                zIndex: 3,
                "&:hover": { bgcolor: "#ffe0b2" },
              }}
            >
              {isFavorite ? (
                <FavoriteIcon fontSize="small" sx={{ color: "#f25c05" }} />
              ) : (
                <FavoriteBorderIcon
                  fontSize="small"
                  sx={{ color: "#f25c05" }}
                />
              )}
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              mb: 1.5,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "#f7f7f7",
              transition: "all 0.3s ease",
            }}
          >
            {product.sale && discountPercent && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  zIndex: 2,
                  bgcolor: "#f25c05",
                  color: "white",
                  px: 1,
                  py: 0.2,
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 1,
                }}
              >
                -{Math.round(discountPercent * 100)}%
              </Box>
            )}
            <Image
              src={product.imageAvt}
              alt={product.name}
              fill
              sizes="(max-width: 600px) 100vw, 240px"
              style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
            />
          </Box>

          <Stack direction="row" spacing={1} mt={0.5}>
            {product.status.map((tag, i) => (
              <Box
                key={i}
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  px: 1,
                  borderRadius: 1,
                  color: "#fff",
                  bgcolor: tag === "Bán chạy" ? "#ffb700" : "#f25c05",
                }}
              >
                {tag}
              </Box>
            ))}
          </Stack>

          <Typography
            fontSize={14}
            fontWeight={600}
            mt={1}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: 36,
            }}
          >
            {product.name}
          </Typography>

          <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
            <Typography fontWeight={700} color="#f25c05">
              {product.price.toLocaleString()}₫
            </Typography>
            {product.price < product.originalPrice && (
              <Typography
                fontSize={13}
                sx={{ textDecoration: "line-through", color: "#999" }}
              >
                {product.originalPrice.toLocaleString()}₫
              </Typography>
            )}
          </Stack>

          {product.rating !== undefined && (
            <Rating
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
              sx={{ mt: 0.5 }}
            />
          )}

          <Button
            fullWidth
            variant={product.inStock ? "contained" : "outlined"}
            disabled={!product.inStock}
            onClick={handleAddToCart}
            sx={{
              mt: 1.2,
              textTransform: "none",
              bgcolor: product.inStock ? "#ffb700" : "#f0f0f0",
              color: product.inStock ? "black" : "gray",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.3s ease",
              "&:hover": { bgcolor: product.inStock ? "#ffc107" : "#f0f0f0" },
            }}
          >
            {product.label}
          </Button>
        </Paper>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
        <DialogContent>
          Bạn cần đăng nhập để{" "}
          {actionType === "cart" ? "mua hàng" : "thêm yêu thích"}.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#ffb700", color: "#000" }}
            onClick={() => router.push("/login?page=login")}
          >
            Đăng nhập
          </Button>
        </DialogActions>
      </Dialog>

      <GlobalSnackbar
        open={snackbar.open}
        type={snackbar.type}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default ProductCard;
