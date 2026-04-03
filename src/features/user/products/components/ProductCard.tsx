"use client";

import React, { useMemo, useState, useCallback } from "react";
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
  Chip,
  Skeleton,
  Zoom,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { mutate } from "swr";
import { CART_COUNT_KEY, WISHLIST_COUNT_KEY } from "@/constants/apiKeys";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import type { AppDispatch, AppState } from "@/redux/store";
import { http } from "@/lib/api/http";
import type { Product } from "@/features/user/products/types";

interface ProductCardProps {
  product: Product;
  mutateKey?: string;
  hideWishlistButton?: boolean;
  onWishlistToggle?: (isFavorite: boolean) => void;
  priority?: boolean;
}

// Loading Skeleton Component
export const ProductCardSkeleton = () => (
  <Paper
    elevation={2}
    sx={{
      width: "100%",
      maxWidth: 240,
      minHeight: 420,
      borderRadius: 2,
      p: 2,
      bgcolor: "#fff",
    }}
  >
    <Skeleton variant="rounded" width="100%" height={200} sx={{ mb: 1.5 }} />
    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
      <Skeleton variant="rounded" width={50} height={20} />
      <Skeleton variant="rounded" width={50} height={20} />
    </Stack>
    <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 0.5 }} />
    <Skeleton variant="text" width="60%" sx={{ fontSize: "1rem", mb: 1 }} />
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
      <Skeleton variant="text" width={80} height={30} />
      <Skeleton variant="text" width={60} height={20} />
    </Stack>
    <Skeleton variant="rounded" width="100%" height={36} />
  </Paper>
);

// Main Component
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  mutateKey,
  hideWishlistButton = false,
  onWishlistToggle,
  priority = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const wishlistItems = useSelector((s: AppState) => s.wishlist.result);
  const favoriteIdSet = useMemo(
    () => new Set(wishlistItems.map((i) => i.id)),
    [wishlistItems],
  );
  const isFavorite = favoriteIdSet.has(product.id);

  // Local state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"favorite" | "cart" | null>(
    null,
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [busyCart, setBusyCart] = useState(false);
  const [busyFav, setBusyFav] = useState(false);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);

  // Price & discount — derived directly from product data (set by mapper, no extra API call)
  const hasDiscount = product.sale && (product.discountPercent ?? 0) > 0;
  const finalPrice = product.price;
  const originalPrice = product.originalPrice;

  // MACHINE = direct add-to-cart; others require variant selection on detail page
  const isMachine =
    !product.productType || product.productType === "MACHINE";

  // Auth check
  const ensureLoggedIn = useCallback(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  }, []);

  const requireLogin = useCallback((type: "favorite" | "cart") => {
    setActionType(type);
    setDialogOpen(true);
  }, []);

  // Navigate to product detail
  const handleCardClick = useCallback(() => {
    router.push(`/product/detail?name=${product.slug}`);
  }, [router, product.slug]);

  // Add to cart handler (machine products only)
  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isMachine) {
        // Non-machine: navigate to detail page to pick variant
        router.push(`/product/detail?name=${product.slug}`);
        return;
      }
      if (!ensureLoggedIn()) return requireLogin("cart");
      if (busyCart) return;

      setBusyCart(true);
      setShowAddedAnimation(true);
      setTimeout(() => setShowAddedAnimation(false), 1000);

      try {
        await http.post("/api/v1/carts", {
          productId: product.id,
          quantity: 1,
        });
        setSnackbar({
          open: true,
          message: "Đã thêm vào giỏ hàng",
          type: "success",
        });
        mutate(CART_COUNT_KEY, undefined, { revalidate: true });
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err?.message || "Lỗi kết nối hoặc xử lý giỏ hàng",
          type: "error",
        });
        setShowAddedAnimation(false);
      } finally {
        setBusyCart(false);
      }
    },
    [product.id, product.slug, isMachine, ensureLoggedIn, requireLogin, busyCart, router],
  );

  // Toggle favorite handler
  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!ensureLoggedIn()) return requireLogin("favorite");
      if (busyFav) return;

      setBusyFav(true);

      try {
        const formData = new FormData();
        formData.append("productId", String(product.id));
        await http.post("/api/v1/wishlist/toggle", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        dispatch(fetchWishlist());
        mutate(WISHLIST_COUNT_KEY, undefined, { revalidate: true });
        if (mutateKey) mutate(mutateKey, undefined, { revalidate: true });

        setSnackbar({
          open: true,
          message: isFavorite
            ? "Đã xóa khỏi yêu thích"
            : "Đã thêm vào yêu thích",
          type: "success",
        });

        onWishlistToggle?.(!isFavorite);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err?.message || "Lỗi khi cập nhật yêu thích",
          type: "error",
        });
      } finally {
        setBusyFav(false);
      }
    },
    [
      product.id,
      isFavorite,
      ensureLoggedIn,
      requireLogin,
      busyFav,
      dispatch,
      mutateKey,
      onWishlistToggle,
    ],
  );

  // Button state
  const buttonLabel = useMemo(() => {
    if (!product.inStock) return "Hết hàng";
    if (!isMachine) return "Xem chi tiết";
    if (busyCart) return "Đang thêm...";
    return "Thêm vào giỏ";
  }, [product.inStock, isMachine, busyCart]);

  const buttonIcon = useMemo(() => {
    if (!isMachine) return <VisibilityIcon />;
    if (busyCart) return <CircularProgress size={16} sx={{ color: "inherit" }} />;
    if (showAddedAnimation) return <CheckCircleIcon />;
    return <AddShoppingCartIcon />;
  }, [isMachine, busyCart, showAddedAnimation]);

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Paper
          onClick={handleCardClick}
          elevation={2}
          sx={{
            width: "100%",
            maxWidth: 240,
            minHeight: 420,
            borderRadius: 3,
            overflow: "hidden",
            p: 2,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: "#fff",
            cursor: "pointer",
            transition: "box-shadow 0.3s",
            "&:hover": {
              boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
            },
          }}
        >
          {/* Wishlist Button */}
          {!hideWishlistButton && (
            <Tooltip
              title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
              arrow
            >
              <IconButton
                onClick={handleToggleFavorite}
                disabled={busyFav}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  width: 32,
                  height: 32,
                  zIndex: 3,
                  "&:hover": {
                    bgcolor: "#fff",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFavorite ? "favorite" : "not-favorite"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ color: "#f25c05", fontSize: 18 }} />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{ color: "#f25c05", fontSize: 18 }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </IconButton>
            </Tooltip>
          )}

          {/* Product Image with Badges */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              mb: 1.5,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "#f7f7f7",
            }}
          >
            {/* Discount Badge — only shown when discount is known from promotion context */}
            {hasDiscount && (
              <Zoom in style={{ transitionDelay: "100ms" }}>
                <Chip
                  label={`-${product.discountPercent}%`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 2,
                    bgcolor: "#f25c05",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />
              </Zoom>
            )}

            {/* Image */}
            <Image
              src={product.imageAvt}
              alt={product.name}
              fill
              sizes="(max-width: 600px) 100vw, 240px"
              priority={priority}
              style={{
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </Box>

          {/* Product Info */}
          <Stack spacing={1} sx={{ flex: 1 }}>
            {/* Status Tags */}
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {product.status.slice(0, 2).map((tag, i) => (
                <Box
                  key={i}
                  sx={{
                    fontSize: 10,
                    fontWeight: 600,
                    px: 0.8,
                    py: 0.3,
                    borderRadius: 0.8,
                    color: "#fff",
                    bgcolor:
                      tag === "Bán chạy"
                        ? "#ffb700"
                        : tag === "Hết hàng"
                          ? "#9e9e9e"
                          : "#f25c05",
                    display: "inline-block",
                  }}
                >
                  {tag}
                </Box>
              ))}
              {product.status.length > 2 && (
                <Typography variant="caption" color="text.secondary">
                  +{product.status.length - 2}
                </Typography>
              )}
            </Stack>

            {/* Product Name */}
            <Tooltip title={product.name} arrow>
              <Typography
                fontSize={14}
                fontWeight={600}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  minHeight: 40,
                  lineHeight: 1.3,
                }}
              >
                {product.name}
              </Typography>
            </Tooltip>

            {/* Price */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={700} color="#f25c05" fontSize={16}>
                {finalPrice.toLocaleString()}₫
              </Typography>
              {hasDiscount && (
                <Typography
                  fontSize={12}
                  sx={{ textDecoration: "line-through", color: "#999" }}
                >
                  {originalPrice.toLocaleString()}₫
                </Typography>
              )}
            </Stack>

            {/* Rating */}
            {typeof product.rating === "number" && product.rating > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Rating
                  value={product.rating}
                  precision={0.5}
                  size="small"
                  readOnly
                  sx={{ color: "#ffb700" }}
                />
                <Typography variant="caption" color="text.secondary">
                  ({product.rating})
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* Action Button */}
          <Button
            fullWidth
            variant={product.inStock ? "contained" : "outlined"}
            disabled={!product.inStock || busyCart}
            onClick={handleAddToCart}
            startIcon={buttonIcon}
            sx={{
              mt: 1.2,
              textTransform: "none",
              bgcolor: product.inStock ? "#ffb700" : "transparent",
              color: product.inStock ? "#000" : "#999",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 2,
              "&:hover": {
                bgcolor: product.inStock ? "#ffc107" : "transparent",
                transform: product.inStock ? "scale(1.02)" : "none",
              },
              transition: "all 0.2s",
            }}
          >
            {buttonLabel}
          </Button>
        </Paper>
      </motion.div>

      {/* Login Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Yêu cầu đăng nhập
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Bạn cần đăng nhập để{" "}
            {actionType === "cart" ? "thêm vào giỏ hàng" : "thêm vào yêu thích"}
            .
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/login?page=login")}
            sx={{
              bgcolor: "#f25c05",
              color: "#fff",
              "&:hover": { bgcolor: "#e64a19" },
            }}
          >
            Đăng nhập
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <GlobalSnackbar
        open={snackbar.open}
        type={snackbar.type}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </>
  );
};

export default React.memo(ProductCard);
