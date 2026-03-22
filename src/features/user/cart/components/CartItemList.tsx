"use client";

import {
  Box,
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

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    await updateQty({ productId, quantity: newQuantity });
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: newQuantity,
              totalPrice: newQuantity * i.unitPrice,
            }
          : i
      )
    );
  };

  const handleDeleteItem = async (productId: number) => {
    await deleteItem(productId);
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    showToast("Đã xoá sản phẩm khỏi giỏ hàng.", "info", "Giỏ hàng");
    swrMutate(CART_COUNT_KEY, undefined, { revalidate: true });
    refreshNotifications();
  };

  // …(phần render giữ nguyên như bạn gửi)
  // do dài, mình giữ nguyên toàn bộ JSX bạn đã có – chỉ thay 2 handler ở trên.
  // === COPY NGUYÊN khối return của bạn, không đổi giao diện ===
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
              <TableCell>Tên</TableCell>
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
                key={item.productId}
                component={motion.tr}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>
                  <Avatar
                    src={`/images/products/${item.productImage}`}
                    alt={item.productName}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{item.productName}</Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
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
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
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
                <TableCell>
                  {item.totalPrice.toLocaleString("vi-VN")}₫
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteItem(item.productId)}
                  >
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
              key={item.productId}
              variant="outlined"
              sx={{ p: 2 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack direction="row" spacing={2}>
                <Avatar
                  src={`/images/products/${item.productImage}`}
                  alt={item.productName}
                  variant="rounded"
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography fontWeight={600}>{item.productName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.productDescription}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Số lượng:</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity - 1)
                    }
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
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity + 1)
                    }
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Đơn giá:</Typography>
                <Typography>
                  {item.unitPrice.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Sale:</Typography>
                <Box textAlign="right">
                  <Typography>
                    {Math.round((item.discount ?? 0) * 100)}%
                  </Typography>
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
                <IconButton
                  color="error"
                  onClick={() => handleDeleteItem(item.productId)}
                >
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
