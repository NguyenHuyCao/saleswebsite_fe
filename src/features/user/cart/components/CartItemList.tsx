"use client";

import {
  Box,
  Checkbox,
  Chip,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Avatar,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Paper,
  Tooltip,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { mutate as swrMutate } from "swr";
import { CART_COUNT_KEY } from "@/constants/apiKeys";
import type { CartItem } from "../types";
import { useDeleteItemMutation, useUpdateQtyMutation } from "../queries";
import { useSocket } from "@/lib/socket/SocketContext";
import { useToast } from "@/lib/toast/ToastContext";
import { getColorHex, isLightColor } from "@/lib/utils/colorMap";

type Props = {
  items: CartItem[];
  onItemsChange?: (items: CartItem[]) => void;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
};

const itemKey = (i: CartItem) =>
  i.variantId ? `${i.productId}-${i.variantId}` : String(i.productId);

export default function CartItemList({
  items: initialItems,
  onItemsChange,
  selectedKeys,
  onSelectionChange,
}: Props) {
  const theme = useTheme();
  const MotionPaper = motion(Paper);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const { showToast } = useToast();
  const { mutateAsync: updateQty } = useUpdateQtyMutation();
  const { mutateAsync: deleteItem } = useDeleteItemMutation();
  const { refresh: refreshNotifications } = useSocket();

  useEffect(() => setItems(initialItems), [initialItems]);

  const isSelected = (item: CartItem) => selectedKeys?.has(itemKey(item)) ?? true;

  const allSelected =
    items.length > 0 && items.every((i) => selectedKeys?.has(itemKey(i)));
  const someSelected =
    items.some((i) => selectedKeys?.has(itemKey(i))) && !allSelected;

  const handleToggleItem = (item: CartItem) => {
    if (!onSelectionChange || !selectedKeys) return;
    const next = new Set(selectedKeys);
    if (next.has(itemKey(item))) {
      next.delete(itemKey(item));
    } else {
      next.add(itemKey(item));
    }
    onSelectionChange(next);
  };

  const handleToggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(items.map(itemKey)));
    }
  };

  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQty({ productId: item.productId, quantity: newQuantity, variantId: item.variantId });
    const newItems = items.map((i) =>
      itemKey(i) === itemKey(item)
        ? { ...i, quantity: newQuantity, totalPrice: newQuantity * i.unitPrice }
        : i
    );
    setItems(newItems);
    onItemsChange?.(newItems);
  };

  const handleDeleteItem = async (item: CartItem) => {
    await deleteItem({ productId: item.productId, variantId: item.variantId });
    const newItems = items.filter((i) => itemKey(i) !== itemKey(item));
    setItems(newItems);
    onItemsChange?.(newItems);
    // Remove from selectedKeys
    if (onSelectionChange && selectedKeys) {
      const next = new Set(selectedKeys);
      next.delete(itemKey(item));
      onSelectionChange(next);
    }
    showToast("Đã xoá sản phẩm khỏi giỏ hàng.", "info", "Giỏ hàng");
    swrMutate(CART_COUNT_KEY, undefined, { revalidate: true });
    refreshNotifications();
  };

  const getOriginalPrice = (item: CartItem) =>
    item.discount ? Math.round(item.unitPrice / (1 - item.discount)) : null;

  const getDiscountPct = (item: CartItem) =>
    item.discount ? Math.round(item.discount * 100) : 0;

  /* ── Sub-components ── */

  const ProductInfo = ({ item }: { item: CartItem }) => (
    <Box>
      <Typography fontWeight={700} fontSize={14} lineHeight={1.4} mb={0.5}>
        {item.productName}
      </Typography>

      {(item.size || item.color) && (
        <Stack direction="row" flexWrap="wrap" gap={0.5} mb={0.75}>
          {item.size && (
            <Chip
              label={`Size: ${item.size}`}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontSize: 11, height: 20 }}
            />
          )}
          {item.color && (() => {
            const hex = getColorHex(item.color);
            const light = hex ? isLightColor(hex) : false;
            return (
              <Box
                display="inline-flex"
                alignItems="center"
                gap={0.5}
                sx={{
                  border: "1.5px solid rgba(0,0,0,0.12)",
                  borderRadius: "10px",
                  px: 0.75,
                  height: 20,
                }}
              >
                <Box
                  sx={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    bgcolor: hex || "#bdbdbd",
                    border: `1px solid ${light ? "#c0c0c0" : "rgba(0,0,0,0.18)"}`,
                    flexShrink: 0,
                  }}
                />
                <Typography fontSize={11} color="text.primary" lineHeight={1}>
                  {item.color}
                </Typography>
              </Box>
            );
          })()}
        </Stack>
      )}

      {item.promotionName && (
        <Box display="flex" alignItems="center" gap={0.5}>
          <LocalOfferIcon sx={{ fontSize: 12, color: "error.main" }} />
          <Typography fontSize={11} color="error.main" fontStyle="italic" noWrap>
            {item.promotionName}
          </Typography>
        </Box>
      )}
    </Box>
  );

  const PriceBlock = ({ item, align = "right" }: { item: CartItem; align?: "left" | "right" }) => {
    const orig = getOriginalPrice(item);
    const pct = getDiscountPct(item);
    return (
      <Box textAlign={align}>
        {orig && (
          <Typography fontSize={11} color="text.disabled" sx={{ textDecoration: "line-through" }}>
            {orig.toLocaleString("vi-VN")}₫
          </Typography>
        )}
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          justifyContent={align === "right" ? "flex-end" : "flex-start"}
        >
          <Typography fontWeight={600} fontSize={14} color={pct > 0 ? "error.main" : "text.primary"}>
            {item.unitPrice.toLocaleString("vi-VN")}₫
          </Typography>
          {pct > 0 && (
            <Chip
              label={`-${pct}%`}
              size="small"
              color="error"
              sx={{ fontSize: 10, height: 18, px: 0 }}
            />
          )}
        </Box>
        {item.maxDiscount ? (
          <Typography fontSize={10} color="text.secondary">
            Tối đa -{item.maxDiscount.toLocaleString()}₫
          </Typography>
        ) : null}
      </Box>
    );
  };

  const QtyControl = ({ item }: { item: CartItem }) => (
    <Box display="flex" alignItems="center" gap={0.5}>
      <IconButton
        size="small"
        onClick={() => handleQuantityChange(item, item.quantity - 1)}
        disabled={item.quantity <= 1}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 0.5 }}
      >
        <RemoveIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <TextField
        value={item.quantity}
        size="small"
        type="number"
        slotProps={{
          input: { readOnly: true   },
        }}
        sx={{
          width: 52,
          "& input": { textAlign: "center", px: 0.5, py: 0.75, fontSize: 14 },
        }}
      />
      <IconButton
        size="small"
        onClick={() => handleQuantityChange(item, item.quantity + 1)}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 0.5 }}
      >
        <AddIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );

  /* ── Desktop table ── */
  if (!isMobile) {
    return (
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Sản phẩm trong giỏ hàng
            <Typography component="span" fontSize={14} fontWeight={400} color="text.secondary" ml={1}>
              ({items.length} sản phẩm)
            </Typography>
          </Typography>
          {onSelectionChange && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleToggleAll}
                  size="small"
                />
              }
              label={
                <Typography fontSize={13} color="text.secondary">
                  Chọn tất cả
                </Typography>
              }
            />
          )}
        </Box>

        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": { verticalAlign: "middle", py: 1.5 },
            "& .MuiTableCell-head": {
              fontWeight: 600,
              fontSize: 13,
              color: "text.secondary",
              bgcolor: "grey.50",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {onSelectionChange && <TableCell width={44} padding="checkbox" />}
              <TableCell width={80}>Ảnh</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell width={165} align="center">Số lượng</TableCell>
              <TableCell width={145} align="right">Đơn giá</TableCell>
              <TableCell width={140} align="right">Thành tiền</TableCell>
              <TableCell width={44} />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const selected = isSelected(item);
              return (
                <TableRow
                  key={itemKey(item)}
                  component={motion.tr as React.ElementType}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background 0.15s",
                    opacity: selected ? 1 : 0.45,
                  }}
                >
                  {onSelectionChange && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected}
                        onChange={() => handleToggleItem(item)}
                        size="small"
                      />
                    </TableCell>
                  )}

                  <TableCell>
                    <Avatar
                      src={item.productImage}
                      alt={item.productName}
                      variant="rounded"
                      sx={{ width: 64, height: 64 }}
                    />
                  </TableCell>

                  <TableCell>
                    <ProductInfo item={item} />
                  </TableCell>

                  <TableCell align="center">
                    <Box display="flex" justifyContent="center">
                      <QtyControl item={item} />
                    </Box>
                  </TableCell>

                  <TableCell>
                    <PriceBlock item={item} align="right" />
                  </TableCell>

                  <TableCell align="right">
                    <Typography fontWeight={700} fontSize={15} color="primary.main">
                      {item.totalPrice.toLocaleString("vi-VN")}₫
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Xoá khỏi giỏ hàng" placement="left">
                      <IconButton color="error" size="small" onClick={() => handleDeleteItem(item)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    );
  }

  /* ── Mobile cards ── */
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Giỏ hàng
          <Typography component="span" fontSize={14} fontWeight={400} color="text.secondary" ml={1}>
            ({items.length})
          </Typography>
        </Typography>
        {onSelectionChange && (
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={handleToggleAll}
                size="small"
              />
            }
            label={
              <Typography fontSize={13} color="text.secondary">
                Chọn tất cả
              </Typography>
            }
          />
        )}
      </Box>

      <Stack spacing={2}>
        {items.map((item) => {
          const selected = isSelected(item);
          return (
            <MotionPaper
              key={itemKey(item)}
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, opacity: selected ? 1 : 0.45, transition: "opacity 0.2s" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: selected ? 1 : 0.45, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Top: checkbox + image + info + delete */}
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                {onSelectionChange && (
                  <Checkbox
                    checked={selected}
                    onChange={() => handleToggleItem(item)}
                    size="small"
                    sx={{ mt: -0.5, p: 0.5, flexShrink: 0 }}
                  />
                )}
                <Avatar
                  src={item.productImage}
                  alt={item.productName}
                  variant="rounded"
                  sx={{ width: 72, height: 72, flexShrink: 0 }}
                />
                <Box flex={1} minWidth={0}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1} pr={0.5}>
                      <ProductInfo item={item} />
                    </Box>
                    <Tooltip title="Xoá">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteItem(item)}
                        sx={{ mt: -0.5, flexShrink: 0 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              {/* Bottom: qty + price */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <QtyControl item={item} />
                <Box textAlign="right">
                  <PriceBlock item={item} align="right" />
                  <Typography fontWeight={700} fontSize={15} color="primary.main" mt={0.25}>
                    = {item.totalPrice.toLocaleString("vi-VN")}₫
                  </Typography>
                </Box>
              </Box>
            </MotionPaper>
          );
        })}
      </Stack>
    </Box>
  );
}
