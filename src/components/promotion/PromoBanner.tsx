"use client";

import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export const PromoBanner = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        width: "100%",
        height: { xs: 250, md: 380 },
        backgroundImage: "url(/images/banner-may-2-thi.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 2,
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(0,0,0,0.4)",
          px: 3,
          py: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          ƯU ĐÃI LỚN MÁY 2 THÌ
        </Typography>
        <Typography variant="body1" mb={2}>
          Giảm đến 40% từ 01/06 – 15/06. Mua nhanh kẻo hết!
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="large"
          sx={{ fontWeight: 600 }}
        >
          Xem khuyến mãi
        </Button>
      </Box>
    </Box>
  );
};
