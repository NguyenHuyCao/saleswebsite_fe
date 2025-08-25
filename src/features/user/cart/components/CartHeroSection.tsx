"use client";
import { Box, Typography, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartHeroSection() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      bgcolor="#f5f5f5"
      p={{ xs: 3, md: 5 }}
      borderRadius={2}
      textAlign="center"
      mb={4}
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <ShoppingCartIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
      </motion.div>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
        sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
      >
        Giỏ hàng
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Xem và chỉnh sửa sản phẩm bạn muốn mua. Hoàn tất đơn hàng chỉ với vài
        bước.
      </Typography>

      <Button
        variant="outlined"
        component={Link}
        href="/product"
        color="primary"
        sx={{ textTransform: "none", px: 3, fontWeight: 600 }}
      >
        Tiếp tục mua hàng
      </Button>
    </Box>
  );
}
