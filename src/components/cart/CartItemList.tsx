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
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect } from "react";

export type CartItem = {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  discount: number;
  maxDiscount?: number;
};

type Props = {
  items: CartItem[];
  onItemsChange?: (items: CartItem[]) => void;
};

const CartItemList = ({ items: initialItems, onItemsChange }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(items);
    }
  }, [items, onItemsChange]);

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    const token = localStorage.getItem("accessToken");
    if (!token || newQuantity < 1) return;

    try {
      const res = await fetch("http://localhost:8080/api/v1/carts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (res.ok) {
        const updated = items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: newQuantity * item.unitPrice,
              }
            : item
        );
        setItems(updated);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const handleDeleteItem = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/carts?productId=${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const filtered = items.filter((item) => item.productId !== productId);
        setItems(filtered);
        setSnackbar({ open: true, message: "Đã xoá sản phẩm khỏi giỏ hàng." });
      }
    } catch (err) {
      console.error("Lỗi khi xoá sản phẩm:", err);
    }
  };

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
              <TableRow key={item.productId}>
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
                    {Math.round(item.discount * 100)}%
                  </Typography>
                  {item.maxDiscount && (
                    <Typography fontSize={12} color="text.secondary">
                      Tối đa: {item.maxDiscount.toLocaleString()}₫
                    </Typography>
                  )}
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
            <Paper key={item.productId} variant="outlined" sx={{ p: 2 }}>
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
                  <Typography>{Math.round(item.discount * 100)}%</Typography>
                  {item.maxDiscount && (
                    <Typography fontSize={12} color="text.secondary">
                      Tối đa: {item.maxDiscount.toLocaleString()}₫
                    </Typography>
                  )}
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
            </Paper>
          ))}
        </Stack>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartItemList;
