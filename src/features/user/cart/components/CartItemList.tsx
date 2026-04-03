"use client";

import {
  Box,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { mutate as swrMutate } from "swr";
import { CART_COUNT_KEY } from "@/constants/apiKeys";
import type { CartItem } from "../types";
import { useDeleteItemMutation, useUpdateQtyMutation } from "../queries";
import { useSocket } from "@/lib/socket/SocketContext";
import { useToast } from "@/lib/toast/ToastContext";

type Props = { items: CartItem[]; onItemsChange?: (items: CartItem[]) => void };

/** Unique key for an item — product + optional variant */
const itemKey = (i: CartItem) =>
  i.variantId ? `${i.productId}-${i.variantId}` : String(i.productId);

export default function CartItemList({
  items: initialItems,
  onItemsChange,
}: Props) {
  const theme = useTheme();
  const MotionPaper = motion(Paper);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const { showToast } = useToast();
  const { mutateAsync: updateQty } = useUpdateQtyMutation();
  const { mutateAsync: deleteItem } = useDeleteItemMutation();
  const { refresh: refreshNotifications } = useSocket();

  useEffect(() => setItems(initialItems), [initialItems]);
  useEffect(() => onItemsChange?.(items), [items, onItemsChange]);

  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQty({ productId: item.productId, quantity: newQuantity, variantId: item.variantId });
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i) === itemKey(item)
          ? { ...i, quantity: newQuantity, totalPrice: newQuantity * i.unitPrice }
          : i
      )
    );
  };

  const handleDeleteItem = async (item: CartItem) => {
    await deleteItem({ productId: item.productId, variantId: item.variantId });
    setItems((prev) => prev.filter((i) => itemKey(i) !== itemKey(item)));
    showToast("Đã xoá sản phẩm khỏi giỏ hàng.", "info", "Giỏ hàng");
    swrMutate(CART_COUNT_KEY, undefined, { revalidate: true });
    refreshNotifications();
  };

  const VariantChips = ({ item }: { item: CartItem }) => (
    <>
      {item.size && <Chip label={`Size: ${item.size}`} size="small" sx={{ mr: 0.5 }} />}
      {item.color && <Chip label={item.color} size="small" variant="outlined" />}
    </>
  );

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Sản phẩm trong giỏ hàng
      </Typography>

      {!isMobile ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên / Biến thể</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Sale</TableCell>
              <TableCell>Tổng</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={itemKey(item)}
                component={motion.tr}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>
                  <Avatar
                    src={item.productImage}
                    alt={item.productName}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{item.productName}</Typography>
                  <Box mt={0.5}><VariantChips item={item} /></Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      size="small"
                      type="number"
                      InputProps={{ readOnly: true }}
                      sx={{ width: 60 }}
                    />
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{item.unitPrice.toLocaleString("vi-VN")}₫</TableCell>
                <TableCell>
                  <Typography fontWeight={500}>
                    {Math.round((item.discount ?? 0) * 100)}%
                  </Typography>
                  {item.maxDiscount ? (
                    <Typography fontSize={12} color="text.secondary">
                      Tối đa: {item.maxDiscount.toLocaleString()}₫
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell>{item.totalPrice.toLocaleString("vi-VN")}₫</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteItem(item)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <MotionPaper
              key={itemKey(item)}
              variant="outlined"
              sx={{ p: 2 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack direction="row" spacing={2}>
                <Avatar
                  src={item.productImage}
                  alt={item.productName}
                  variant="rounded"
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography fontWeight={600}>{item.productName}</Typography>
                  <Box mt={0.5}><VariantChips item={item} /></Box>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Số lượng:</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    value={item.quantity}
                    size="small"
                    type="number"
                    InputProps={{ readOnly: true }}
                    sx={{ width: 50 }}
                  />
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Đơn giá:</Typography>
                <Typography>{item.unitPrice.toLocaleString("vi-VN")}₫</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Sale:</Typography>
                <Box textAlign="right">
                  <Typography>{Math.round((item.discount ?? 0) * 100)}%</Typography>
                  {item.maxDiscount ? (
                    <Typography fontSize={12} color="text.secondary">
                      Tối đa: {item.maxDiscount.toLocaleString()}₫
                    </Typography>
                  ) : null}
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Tổng:</Typography>
                <Typography fontWeight={600}>
                  {item.totalPrice.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>

              <Box mt={2} textAlign="right">
                <IconButton color="error" onClick={() => handleDeleteItem(item)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </MotionPaper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
