"use client";

import React, { useState } from "react";
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
  const [openDialog, setOpenDialog] = useState(false);
  const [authAction, setAuthAction] = useState<"favorite" | "cart" | null>(
    null
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleRequireLogin = (action: "favorite" | "cart") => {
    setAuthAction(action);
    setOpenDialog(true);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const token = localStorage.getItem("accessToken");

    if (!token) {
      handleRequireLogin("cart");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Đã thêm sản phẩm vào giỏ hàng!",
          type: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Thêm vào giỏ hàng thất bại.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      setSnackbar({
        open: true,
        message: "Lỗi kết nối đến máy chủ.",
        type: "error",
      });
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      handleRequireLogin("favorite");
      return;
    }

    onToggleFavorite?.(product.id);
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
            width: 220,
            height: 350,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
            transition: "transform 0.3s ease",
            flexShrink: 0,
            "&:hover": {
              transform: "translateY(-4px)",
            },
          }}
        >
          {product.sale && (
            <Box
              sx={{
                bgcolor: "#f25c05",
                color: "white",
                px: 1,
                py: 0.2,
                fontSize: 12,
                fontWeight: "bold",
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 2,
              }}
            >
              Sale
            </Box>
          )}

          <Tooltip title="Yêu thích">
            <IconButton
              onClick={handleFavoriteToggle}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "white",
                boxShadow: 1,
                width: 28,
                height: 28,
                zIndex: 2,
                "&:hover": { bgcolor: "#ffe0b2" },
              }}
              aria-label="toggle favorite"
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
            position="relative"
            height={150}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ backgroundColor: "#fafafa" }}
          >
            <Image
              src={product.image}
              alt={product.title}
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
            />
          </Box>

          <Stack direction="row" spacing={1} mt={1}>
            {product.status.map((s, idx) => (
              <Box
                key={idx}
                sx={{
                  bgcolor: s === "Bán chạy" ? "#ffb700" : "#f25c05",
                  color: "white",
                  fontSize: 12,
                  fontWeight: "bold",
                  px: 1,
                  borderRadius: 0.5,
                }}
              >
                {s}
              </Box>
            ))}
          </Stack>

          <Typography
            fontSize={14}
            fontWeight={600}
            mt={1}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 40,
            }}
          >
            {product.title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
            <Typography color="#f25c05" fontWeight="bold">
              {typeof product.price === "number"
                ? `${product.price.toLocaleString()}₫`
                : "Đang cập nhật"}
            </Typography>
            <Typography
              fontSize={13}
              sx={{ textDecoration: "line-through", color: "gray" }}
            >
              {typeof product.originalPrice === "number"
                ? `${product.originalPrice.toLocaleString()}₫`
                : ""}
            </Typography>
          </Stack>

          {product.rating !== undefined && (
            <Rating
              name="product-rating"
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
              sx={{ mt: 0.5 }}
            />
          )}

          <Box mt={"auto"}>
            <Button
              fullWidth
              variant={product.inStock ? "contained" : "outlined"}
              disabled={!product.inStock}
              onClick={handleAddToCart}
              sx={{
                mt: 1,
                bgcolor: product.inStock ? "#ffb700" : "#f0f0f0",
                color: product.inStock ? "black" : "gray",
                fontWeight: 600,
                textTransform: "none",
                fontSize: 14,
              }}
            >
              {product.label}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Bạn chưa đăng nhập</DialogTitle>
        <DialogContent>
          Vui lòng đăng nhập để{" "}
          {authAction === "cart" ? "thêm vào giỏ hàng" : "thêm vào yêu thích"}.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Xem tiếp</Button>
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog(false);
              router.push("http://localhost:3000/login?page=login");
            }}
            autoFocus
            sx={{ bgcolor: "#ffb700", color: "black", fontWeight: 600 }}
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
