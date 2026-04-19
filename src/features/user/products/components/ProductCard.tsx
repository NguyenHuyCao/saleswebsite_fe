"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import FlashOnIcon from "@mui/icons-material/FlashOn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GlobalSnackbar from "@/components/feedback/GlobalSnackbar";
import { trackRVItem } from "@/lib/utils/recentlyViewed";
import { mutate } from "swr";
import { CART_COUNT_KEY, WISHLIST_COUNT_KEY } from "@/constants/apiKeys";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import type { AppDispatch, AppState } from "@/redux/store";
import { http } from "@/lib/api/http";
import type { Product } from "@/features/user/products/types";
import ProductQuickActionDialog from "./ProductQuickActionDialog";
import type { QuickActionMode } from "./ProductQuickActionDialog";

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
      height: "100%",
      minHeight: { xs: 300, sm: 360, md: 380 },
      borderRadius: 2,
      p: { xs: 1.5, sm: 2 },
      bgcolor: "#fff",
      display: "flex",
      flexDirection: "column",
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
  const qc = useQueryClient();

  // Redux state
  const wishlistItems = useSelector((s: AppState) => s.wishlist.result);
  const favoriteIdSet = useMemo(
    () => new Set(wishlistItems.map((i) => i.id)),
    [wishlistItems],
  );
  const isFavorite = favoriteIdSet.has(product.id);

  // Login dialog
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginActionType, setLoginActionType] = useState<"favorite" | "cart" | null>(null);

  // Quick action dialog (variant + qty selection)
  const [quickDialogOpen, setQuickDialogOpen] = useState(false);
  const [quickDialogMode, setQuickDialogMode] = useState<QuickActionMode>("cart");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [busyCart, setBusyCart] = useState(false);
  const [busyFav, setBusyFav] = useState(false);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);

  // Price & discount
  const hasDiscount = product.sale && (product.discountPercent ?? 0) > 0;
  const finalPrice = product.price;
  const originalPrice = product.originalPrice;

  // Products with active variants always need dialog regardless of productType
  const needsVariant = product.hasVariants === true;
  // MACHINE = direct add-to-cart only when product has no active variants
  const isMachine = !product.productType || product.productType === "MACHINE";

  // Auth check
  const ensureLoggedIn = useCallback(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  }, []);

  const requireLogin = useCallback((type: "favorite" | "cart") => {
    setLoginActionType(type);
    setLoginDialogOpen(true);
  }, []);

  // Navigate to product detail on card click
  const handleCardClick = useCallback(() => {
    trackRVItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageAvt: product.imageAvt,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      inStock: product.inStock,
    });
    router.push(`/product/detail?name=${product.slug}`);
  }, [router, product]);

  // Cart icon: add to cart (with variant dialog for non-machine)
  const handleCartAction = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!product.inStock) return;
      if (!ensureLoggedIn()) return requireLogin("cart");

      if (needsVariant) {
        setQuickDialogMode("cart");
        setQuickDialogOpen(true);
        return;
      }

      // No variants: direct add
      if (busyCart) return;
      setBusyCart(true);
      setShowAddedAnimation(true);
      setTimeout(() => setShowAddedAnimation(false), 1000);

      try {
        await http.post("/api/v1/carts", { productId: product.id, quantity: 1 });
        setSnackbar({ open: true, message: "Đã thêm vào giỏ hàng", type: "success" });
        mutate(CART_COUNT_KEY, undefined, { revalidate: true });
        qc.invalidateQueries({ queryKey: ["cart"] });
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
    [product.id, product.inStock, isMachine, ensureLoggedIn, requireLogin, busyCart, qc],
  );

  // Order button: add to cart + go to /cart
  const handleOrderAction = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!product.inStock) return;
      if (!ensureLoggedIn()) return requireLogin("cart");

      if (needsVariant) {
        setQuickDialogMode("order");
        setQuickDialogOpen(true);
        return;
      }

      // No variants: add then navigate
      if (busyCart) return;
      setBusyCart(true);
      try {
        await http.post("/api/v1/carts", { productId: product.id, quantity: 1 });
        mutate(CART_COUNT_KEY, undefined, { revalidate: true });
        qc.invalidateQueries({ queryKey: ["cart"] });
        router.push(`/cart?select=${product.id}`);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err?.message || "Lỗi kết nối hoặc xử lý giỏ hàng",
          type: "error",
        });
      } finally {
        setBusyCart(false);
      }
    },
    [product.id, product.inStock, isMachine, ensureLoggedIn, requireLogin, busyCart, router, qc],
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
          message: isFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
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

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{ height: "100%" }}
      >
        <Paper
          onClick={handleCardClick}
          elevation={2}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 3,
            overflow: "hidden",
            p: { xs: 1.5, sm: 2 },
            position: "relative",
            display: "flex",
            flexDirection: "column",
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
            <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"} arrow>
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
                  "&:hover": { bgcolor: "#fff", transform: "scale(1.1)" },
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
                      <FavoriteBorderIcon sx={{ color: "#f25c05", fontSize: 18 }} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </IconButton>
            </Tooltip>
          )}

          {/* Product Image */}
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

            <Image
              src={product.imageAvt}
              alt={product.name}
              fill
              sizes="(max-width: 600px) 100vw, 240px"
              priority={priority}
              style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            />
          </Box>

          {/* Product Info */}
          <Stack spacing={0.75}>
            {/* Status Tags — always reserves 20px height so cards align */}
            <Box sx={{ minHeight: 20 }}>
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
                        tag === "Bán chạy" ? "#ffb700" : tag === "Hết hàng" ? "#9e9e9e" : "#f25c05",
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
            </Box>

            {/* Product Name */}
            <Tooltip title={product.name} arrow>
              <Typography
                fontWeight={600}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  minHeight: { xs: 36, sm: 40 },
                  lineHeight: 1.4,
                  fontSize: { xs: "0.78rem", sm: "0.875rem" },
                }}
              >
                {product.name}
              </Typography>
            </Tooltip>

            {/* Price — strikethrough always rendered to reserve space */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={700} color="#f25c05" sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
                {finalPrice.toLocaleString()}₫
              </Typography>
              <Typography
                sx={{
                  textDecoration: "line-through",
                  color: "#999",
                  visibility: hasDiscount ? "visible" : "hidden",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                }}
              >
                {originalPrice?.toLocaleString() ?? "0"}₫
              </Typography>
            </Stack>

            {/* Rating — always reserves 22px height */}
            <Box sx={{ minHeight: 22 }}>
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
            </Box>
          </Stack>

          {/* Action Buttons — mt:auto pushes to card bottom */}
          <Stack direction="row" spacing={0.5} sx={{ mt: "auto", pt: { xs: 1, sm: 1.5 } }}>
            {/* Cart icon button */}
            <Tooltip
              title={
                !product.inStock
                  ? "Hết hàng"
                  : needsVariant
                  ? "Chọn và thêm vào giỏ"
                  : "Thêm vào giỏ hàng"
              }
              arrow
            >
              <span>
                <IconButton
                  onClick={handleCartAction}
                  disabled={!product.inStock || busyCart}
                  size="small"
                  sx={{
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    borderRadius: 2,
                    border: "1.5px solid",
                    borderColor: product.inStock ? "#ffb700" : "#e0e0e0",
                    bgcolor: product.inStock ? "#fff8e1" : "transparent",
                    flexShrink: 0,
                    "&:hover": {
                      bgcolor: product.inStock ? "#fff3cd" : "transparent",
                      borderColor: product.inStock ? "#f25c05" : "#e0e0e0",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showAddedAnimation ? "check" : "cart"}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {busyCart ? (
                        <CircularProgress size={16} sx={{ color: "#f25c05" }} />
                      ) : showAddedAnimation ? (
                        <CheckCircleIcon sx={{ fontSize: 18, color: "#4caf50" }} />
                      ) : (
                        <AddShoppingCartIcon
                          sx={{ fontSize: 18, color: product.inStock ? "#f25c05" : "#bbb" }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </IconButton>
              </span>
            </Tooltip>

            {/* Order button */}
            <Button
              fullWidth
              variant={product.inStock ? "contained" : "outlined"}
              disabled={!product.inStock || busyCart}
              onClick={handleOrderAction}
              size="small"
              startIcon={product.inStock ? <FlashOnIcon sx={{ fontSize: 15 }} /> : undefined}
              sx={{
                textTransform: "none",
                bgcolor: product.inStock ? "#f25c05" : "transparent",
                color: product.inStock ? "#fff" : "#999",
                fontWeight: 600,
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
                borderRadius: 2,
                height: { xs: 32, sm: 36 },
                minWidth: 0,
                px: { xs: 0.75, sm: 1.5 },
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: product.inStock ? "#e64a19" : "transparent",
                },
                transition: "all 0.2s",
                "& .MuiButton-startIcon": {
                  display: { xs: "none", sm: "flex" },
                  mr: { xs: 0, sm: "6px" },
                  ml: { xs: 0, sm: "-2px" },
                },
              }}
            >
              {product.inStock ? "Đặt hàng" : "Hết hàng"}
            </Button>
          </Stack>
        </Paper>
      </motion.div>

      {/* Quick Action Dialog (variant selection) */}
      <ProductQuickActionDialog
        open={quickDialogOpen}
        onClose={() => setQuickDialogOpen(false)}
        product={product}
        mode={quickDialogMode}
      />

      {/* Login Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
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
            {loginActionType === "cart" ? "thêm vào giỏ hàng" : "thêm vào yêu thích"}.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setLoginDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/login?page=login")}
            sx={{ bgcolor: "#f25c05", color: "#fff", "&:hover": { bgcolor: "#e64a19" } }}
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
