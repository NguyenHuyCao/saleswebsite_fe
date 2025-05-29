"use client";

import { Box, Typography, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";

const CartHeroSection = () => {
  return (
    <Box bgcolor="#f5f5f5" p={4} borderRadius={2} textAlign="center">
      <ShoppingCartIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
      <Typography variant="h4" fontWeight={700}>
        Giỏ hàng
      </Typography>
      <Typography mb={2}>
        Xem và chỉnh sửa sản phẩm bạn muốn mua. Hoàn tất đơn hàng chỉ với vài
        bước.
      </Typography>
      <Button
        variant="outlined"
        component={Link}
        href="/products"
        color="primary"
      >
        Tiếp tục mua hàng
      </Button>
    </Box>
  );
};

export default CartHeroSection;
