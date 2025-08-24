"use client";

import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

export default function OrderHistoryHeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      sx={{
        bgcolor: "#e3f2fd",
        px: { xs: 3, md: 6 },
        py: { xs: 6, md: 10 },
        borderRadius: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        overflow: "hidden",
      }}
    >
      <Box flex={1}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          gutterBottom
          color="#0d47a1"
        >
          Lịch sử đơn hàng của bạn
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={3}
          maxWidth={500}
        >
          Theo dõi, xem chi tiết và xử lý đơn hàng một cách dễ dàng. Mọi thông
          tin đều được cập nhật minh bạch và nhanh chóng.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ textTransform: "none", fontWeight: 600 }}
          href="/product"
        >
          Tiếp tục mua sắm
        </Button>
      </Box>

      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        component={motion.div}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/images/banner/istockphoto-1639694829-612x612.jpg"
          alt="Order Illustration"
          width={isMobile ? 240 : 320}
          height={isMobile ? 160 : 220}
          style={{
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          priority
        />
      </Box>
    </Box>
  );
}
