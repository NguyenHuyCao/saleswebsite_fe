"use client";

import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

const OrderHistoryHeroSection = () => {
  return (
    <Box
      sx={{
        bgcolor: "#e3f2fd",
        px: 4,
        py: 6,
        textAlign: "center",
        borderRadius: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: 4,
      }}
    >
      <Box flex={1}>
        <Typography variant="h4" fontWeight={700} gutterBottom color="#0d47a1">
          Lịch sử đơn hàng của bạn
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Theo dõi, xem chi tiết và xử lý đơn hàng một cách dễ dàng. Mọi thông
          tin đều được cập nhật minh bạch và nhanh chóng.
        </Typography>
        <Button variant="contained" color="primary" href="/products">
          Tiếp tục mua sắm
        </Button>
      </Box>

      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Image
          src="/images/banner/istockphoto-1639694829-612x612.jpg"
          alt="Order Illustration"
          width={320}
          height={220}
          style={{ objectFit: "contain" }}
        />
      </Box>
    </Box>
  );
};

export default OrderHistoryHeroSection;
