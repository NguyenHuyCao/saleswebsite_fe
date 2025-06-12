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
import GlobalSnackbar from "../alert/GlobalSnackbar";
import { mutate } from "swr";
import { CART_COUNT_KEY, WISHLIST_COUNT_KEY } from "@/constants/apiKeys";

export type Product = {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  status: string[];
  sale: boolean;
  inStock: boolean;
  label: string;
  totalStock: number;
  stockQuantity: number;
  createdAt: string;
  rating?: number;
  slug: string;
  isFavorite?: boolean;
};

type Props = {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: number) => void;
};

const ProductCard = ({
  product,
  isFavorite = false,
  onToggleFavorite,
}: Props) => {
  const router = useRouter();
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
          `http://localhost:8080/api/v1/promotions/product?productId=${product.id}`
        );
        const promo = await res.json();
        if (promo?.data?.discount) {
          setDiscountPercent(promo.data.discount);
        }
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
    if (!token) {
      requireLogin("cart");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

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
    } catch (err) {
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
    if (!token) {
      requireLogin("favorite");
      return;
    }

    if (onToggleFavorite) {
      await onToggleFavorite(product.id);
      mutate(WISHLIST_COUNT_KEY);
    }
  };

  return (
    <>
      <Box
        onClick={() => router.push(`/product/detail?name=${product.slug}`)}
        sx={{ cursor: "pointer" }}
      >
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            maxWidth: 240,
            minHeight: 360,
            borderRadius: 2,
            overflow: "hidden",
            p: 2,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.3s",
            "&:hover": { transform: "translateY(-4px)" },
          }}
        >
          {/* Sale Badge */}
          {product.sale && discountPercent && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
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

          {/* Favorite Button */}
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

          {/* Image */}
          <Box
            sx={{
              height: 140,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f7f7f7",
            }}
          >
            <Image
              src={product.image}
              alt={product.title}
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Status */}
          <Stack direction="row" spacing={1} mt={1}>
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

          {/* Title */}
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
            {product.title}
          </Typography>

          {/* Price */}
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

          {/* Rating */}
          {product.rating !== undefined && (
            <Rating
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
              sx={{ mt: 0.5 }}
            />
          )}

          {/* Add to Cart */}
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
              "&:hover": {
                bgcolor: product.inStock ? "#ffc107" : "#f0f0f0",
              },
            }}
          >
            {product.label}
          </Button>
        </Paper>
      </Box>

      {/* Login Required Dialog */}
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
