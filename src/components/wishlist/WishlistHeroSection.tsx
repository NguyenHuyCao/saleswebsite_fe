"use client";

import { Box, Typography, Button } from "@mui/material";

const WishlistHeroSection = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: 4,
        textAlign: "center",
        borderRadius: 3,
        backgroundImage: "url('/images/banner/banner-may-cat-co.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Danh sách yêu thích của bạn
      </Typography>
      <Typography variant="body1" mb={3}>
        Lưu lại những sản phẩm bạn muốn sở hữu – Dễ dàng quay lại và đặt hàng
        bất cứ lúc nào.
      </Typography>
      <Button variant="contained" color="secondary" href="/products">
        Khám phá sản phẩm ngay
      </Button>
    </Box>
  );
};

export default WishlistHeroSection;
