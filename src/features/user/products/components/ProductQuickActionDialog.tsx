"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
  Avatar,
  CircularProgress,
  TextField,
  Divider,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { useRouter } from "next/navigation";
import { api, http } from "@/lib/api/http";
import { mutate } from "swr";
import { CART_COUNT_KEY } from "@/constants/apiKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/toast/ToastContext";
import { useSocket } from "@/lib/socket/SocketContext";
import type { Product, ProductVariant } from "@/features/user/products/types";

export type QuickActionMode = "cart" | "order";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product;
  mode: QuickActionMode;
};

export default function ProductQuickActionDialog({ open, onClose, product, mode }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { refresh: refreshNotifications } = useSocket();

  const [fetching, setFetching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fullVariants, setFullVariants] = useState<ProductVariant[]>([]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const isMachine = !product.productType || product.productType === "MACHINE";

  // Merged variants: prefer fetched over prop (more up-to-date)
  const activeVariants = (
    fullVariants.length > 0 ? fullVariants : (product.variants ?? [])
  ).filter((v) => v.active);

  const hasVariants = !isMachine && activeVariants.length > 0;

  const uniqueSizes = [
    ...new Set(activeVariants.map((v) => v.size).filter(Boolean)),
  ] as string[];
  const uniqueColors = [
    ...new Set(activeVariants.map((v) => v.color).filter(Boolean)),
  ] as string[];

  const effectiveStock = selectedVariant
    ? selectedVariant.stockQuantity
    : hasVariants
    ? activeVariants.reduce((s, v) => s + v.stockQuantity, 0)
    : product.stockQuantity ?? 0;

  // Sync selectedVariant when size/color changes
  useEffect(() => {
    if (!hasVariants) { setSelectedVariant(null); return; }
    if (!selectedSize && !selectedColor) { setSelectedVariant(null); return; }
    const match =
      activeVariants.find(
        (v) =>
          (!selectedSize || v.size === selectedSize) &&
          (!selectedColor || v.color === selectedColor)
      ) ?? null;
    setSelectedVariant(match);
  }, [selectedSize, selectedColor, hasVariants, activeVariants.length]);

  // Reset + lazy-fetch variants when dialog opens
  useEffect(() => {
    if (!open) {
      setSelectedSize(null);
      setSelectedColor(null);
      setSelectedVariant(null);
      setQuantity(1);
      setFullVariants([]);
      return;
    }

    const hasPropVariants = (product.variants?.length ?? 0) > 0;
    if (hasPropVariants || isMachine) return; // already have data or not needed

    // Non-machine without cached variants → fetch
    setFetching(true);
    api
      .get<any>(`/api/v1/products/${encodeURIComponent(product.slug)}`)
      .then((raw) => {
        const variants: ProductVariant[] = raw?.variants ?? [];
        setFullVariants(variants);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [open]);

  const isColorAvailable = (color: string) => {
    if (!selectedSize)
      return activeVariants.some((v) => v.color === color && v.stockQuantity > 0);
    return activeVariants.some(
      (v) => v.size === selectedSize && v.color === color && v.stockQuantity > 0
    );
  };

  const isSizeAvailable = (size: string) => {
    if (!selectedColor)
      return activeVariants.some((v) => v.size === size && v.stockQuantity > 0);
    return activeVariants.some(
      (v) => v.size === size && v.color === selectedColor && v.stockQuantity > 0
    );
  };

  const handleAction = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      onClose();
      router.push("/login?page=login");
      return;
    }

    if (hasVariants && !selectedVariant) {
      showToast("Vui lòng chọn kích cỡ / màu sắc trước.", "error", "Chọn biến thể");
      return;
    }

    setBusy(true);
    try {
      await http.post("/api/v1/carts", {
        productId: product.id,
        quantity,
        variantId: selectedVariant?.id ?? undefined,
      });

      mutate(CART_COUNT_KEY, undefined, { revalidate: true });
      qc.invalidateQueries({ queryKey: ["cart"] });
      refreshNotifications();

      onClose();
      if (mode === "order") {
        // Build the select key so the cart page pre-selects only this item
        const selectKey = selectedVariant
          ? `${product.id}-${selectedVariant.id}`
          : String(product.id);
        router.push(`/cart?select=${selectKey}`);
      } else {
        showToast(
          `Đã thêm ${quantity > 1 ? `${quantity}× ` : ""}${product.name} vào giỏ hàng!`,
          "success",
          "Giỏ hàng"
        );
      }
    } catch (e: any) {
      showToast(e?.message || "Thêm vào giỏ thất bại.", "error", "Lỗi");
    } finally {
      setBusy(false);
    }
  };

  const displayPrice = selectedVariant?.priceOverride ?? product.price;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1, pr: 6 }}>
        <Typography fontWeight={700} fontSize={16}>
          {mode === "order" ? "Mua ngay" : "Thêm vào giỏ hàng"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {/* Product info */}
        <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
          <Avatar
            src={product.imageAvt}
            alt={product.name}
            variant="rounded"
            sx={{ width: 72, height: 72, flexShrink: 0, borderRadius: 2 }}
          />
          <Box>
            <Typography fontWeight={600} fontSize={14} lineHeight={1.4} mb={0.5}>
              {product.name}
            </Typography>
            {product.sale && product.originalPrice > displayPrice && (
              <Typography
                fontSize={11}
                color="text.disabled"
                sx={{ textDecoration: "line-through" }}
              >
                {product.originalPrice.toLocaleString("vi-VN")}₫
              </Typography>
            )}
            <Typography fontWeight={700} fontSize={18} color="error.main">
              {displayPrice > 0
                ? `${displayPrice.toLocaleString("vi-VN")}₫`
                : "Liên hệ báo giá"}
            </Typography>
          </Box>
        </Stack>

        {fetching ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            {/* Size selector */}
            {uniqueSizes.length > 0 && (
              <Box mb={2}>
                <Typography variant="body2" fontWeight={600} mb={0.75}>
                  Kích cỡ:{" "}
                  {selectedSize && (
                    <span style={{ color: "#f25c05" }}>{selectedSize}</span>
                  )}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {uniqueSizes.map((size) => {
                    const available = isSizeAvailable(size);
                    return (
                      <Chip
                        key={size}
                        label={size}
                        size="small"
                        variant={selectedSize === size ? "filled" : "outlined"}
                        color={selectedSize === size ? "warning" : "default"}
                        onClick={() =>
                          available &&
                          setSelectedSize(selectedSize === size ? null : size)
                        }
                        disabled={!available}
                        sx={{
                          cursor: available ? "pointer" : "not-allowed",
                          opacity: available ? 1 : 0.4,
                          fontWeight: selectedSize === size ? 700 : 400,
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Color selector */}
            {uniqueColors.length > 0 && (
              <Box mb={2}>
                <Typography variant="body2" fontWeight={600} mb={0.75}>
                  Màu sắc:{" "}
                  {selectedColor && (
                    <span style={{ color: "#f25c05" }}>{selectedColor}</span>
                  )}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {uniqueColors.map((color) => {
                    const available = isColorAvailable(color);
                    return (
                      <Chip
                        key={color}
                        label={color}
                        size="small"
                        variant={selectedColor === color ? "filled" : "outlined"}
                        color={selectedColor === color ? "warning" : "default"}
                        onClick={() =>
                          available &&
                          setSelectedColor(selectedColor === color ? null : color)
                        }
                        disabled={!available}
                        sx={{
                          cursor: available ? "pointer" : "not-allowed",
                          opacity: available ? 1 : 0.4,
                          fontWeight: selectedColor === color ? 700 : 400,
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            )}

            {hasVariants && (selectedSize || selectedColor) && !selectedVariant && (
              <Typography variant="body2" color="error" mb={1.5} fontSize={12}>
                Không có biến thể phù hợp với lựa chọn này.
              </Typography>
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Quantity */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" fontWeight={600}>
                Số lượng:
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton
                  size="small"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 0.5,
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <TextField
                  value={quantity}
                  size="small"
                  type="number"
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!Number.isNaN(val) && val >= 1 && val <= effectiveStock)
                      setQuantity(val);
                  }}
                  sx={{
                    width: 56,
                    "& input": { textAlign: "center", px: 0.5, py: 0.75, fontSize: 14 },
                  }}
                />
                <IconButton
                  size="small"
                  disabled={quantity >= effectiveStock}
                  onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 0.5,
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography variant="caption" color="text.secondary" ml={0.5}>
                  / {effectiveStock}
                </Typography>
              </Stack>
            </Box>
          </>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" fullWidth size="small">
          Hủy
        </Button>
        <Button
          onClick={handleAction}
          variant="contained"
          fullWidth
          size="small"
          disabled={busy || fetching || !product.inStock}
          startIcon={
            busy ? (
              <CircularProgress size={14} sx={{ color: "inherit" }} />
            ) : mode === "order" ? (
              <FlashOnIcon />
            ) : (
              <ShoppingCartIcon />
            )
          }
          sx={{
            bgcolor: mode === "order" ? "#f25c05" : "#ffb700",
            color: mode === "order" ? "#fff" : "#000",
            fontWeight: 700,
            "&:hover": {
              bgcolor: mode === "order" ? "#e64a19" : "#ffc107",
            },
          }}
        >
          {mode === "order" ? "Mua ngay" : "Thêm vào giỏ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
