"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation"; // ✅ import useRouter

const CartSummary = () => {
  const router = useRouter(); // ✅ khởi tạo router

  const handleCheckout = () => {
    router.push("/checkout"); // ✅ điều hướng
  };

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Tổng kết đơn hàng
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Subtotal */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Thành tiền:</Typography>
        <Typography fontWeight={600}>246.268.246₫</Typography>
      </Box>

      {/* Shipping method */}
      <Box mb={2}>
        <Typography mb={1}>Phí vận chuyển:</Typography>
        <RadioGroup defaultValue="standard">
          <FormControlLabel
            value="standard"
            control={<Radio />}
            label="Giao hàng tiêu chuẩn (miễn phí)"
          />
          <FormControlLabel
            value="express"
            control={<Radio />}
            label="Giao hàng nhanh (30.000₫)"
          />
        </RadioGroup>
      </Box>

      {/* Địa chỉ nhận hàng */}
      <Box mb={2}>
        <Typography>Địa chỉ giao hàng:</Typography>
        <Typography variant="body2" color="text.secondary">
          123 Đường ABC, TP. Hồ Chí Minh
        </Typography>
        <Button size="small" sx={{ mt: 1 }}>
          Thay đổi
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tổng cộng */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography fontWeight={600}>Tổng cộng:</Typography>
        <Typography fontWeight={700} color="primary">
          246.268.246₫
        </Typography>
      </Box>

      {/* Coupon input */}
      <Stack direction="row" spacing={1} mb={2}>
        <TextField fullWidth placeholder="Nhập mã giảm giá" size="small" />
        <Button variant="contained">apply</Button>
      </Stack>

      {/* Action buttons */}
      <Stack spacing={1}>
        <Button variant="outlined" color="error">
          Xoá tất cả
        </Button>
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Tiến hành đặt hàng
        </Button>
      </Stack>
    </Paper>
  );
};

export default CartSummary;
