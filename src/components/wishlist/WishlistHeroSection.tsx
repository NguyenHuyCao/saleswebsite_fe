"use client";

import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

const WishlistHeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        textAlign: "center",
        borderRadius: 3,
        overflow: "hidden",
        backgroundImage: "url('/images/banner/banner-may-cat-co.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}
    >
      {/* Overlay to enhance contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.4)",
          zIndex: 0,
        }}
      />

      {/* Content with animation */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 700,
          mx: "auto",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          gutterBottom
        >
          Danh sách yêu thích của bạn
        </Typography>
        <Typography
          variant="body1"
          mb={3}
          sx={{ maxWidth: 600, mx: "auto", color: "#f5f5f5" }}
        >
          Lưu lại những sản phẩm bạn muốn sở hữu – Dễ dàng quay lại và đặt hàng
          bất cứ lúc nào.
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="large"
          href="/products"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            ":hover": {
              bgcolor: "#ffa000",
            },
          }}
        >
          Khám phá sản phẩm ngay
        </Button>
      </Box>
    </Box>
  );
};

export default WishlistHeroSection;
