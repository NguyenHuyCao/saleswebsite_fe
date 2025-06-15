"use client";

import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface CartItemRowProps {
  product: {
    productId: number;
    productName: string;
    productDescription: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  };
}

const CartItemRow = ({ product }: CartItemRowProps) => {
  return (
    <Box
      component="div"
      sx={{
        border: "1px solid #eee",
        borderRadius: 2,
        p: 2,
        transition: "0.3s",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Ảnh sản phẩm */}
        <Grid size={{ xs: 12, sm: 2 }}>
          <Avatar
            src={product.productImage}
            alt={product.productName}
            variant="rounded"
            sx={{ width: "100%", height: "auto", borderRadius: 2 }}
          />
        </Grid>

        {/* Tên và mô tả */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {product.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.productDescription}
          </Typography>
        </Grid>

        {/* Số lượng */}
        <Grid size={{ xs: 6, sm: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small" color="primary">
              <RemoveIcon />
            </IconButton>
            <TextField
              value={product.quantity}
              size="small"
              type="number"
              inputProps={{ min: 1 }}
              sx={{ width: 60 }}
            />
            <IconButton size="small" color="primary">
              <AddIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Đơn giá */}
        <Grid size={{ xs: 6, sm: 2 }}>
          <Typography color="text.secondary" fontWeight={500}>
            {product.unitPrice.toLocaleString("vi-VN")}₫
          </Typography>
        </Grid>

        {/* Tổng tiền + nút xoá */}
        <Grid
          size={{ xs: 12, sm: 2 }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight={600}>
            {product.totalPrice.toLocaleString("vi-VN")}₫
          </Typography>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Divider dưới mỗi dòng */}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default CartItemRow;
