"use client";

import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const ContactHeroSection = () => {
  return (
    <Box
      position="relative"
      height={{ xs: "70vh", md: "80vh" }}
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ overflow: "hidden" }}
    >
      {/* Background Image */}
      <Image
        src="/images/banner/360_F_229670001_Ju6K5ezKiyJphkwj316zT31XifNHJoPT.jpg"
        alt="Team working"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />

      {/* Overlay (optional) */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bgcolor="rgba(0, 0, 0, 0.4)"
        zIndex={1}
      />

      {/* Content */}
      <Box
        position="relative"
        zIndex={2}
        textAlign="center"
        color="white"
        px={3}
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn!
        </Typography>
        <Typography mb={4}>
          Đừng ngần ngại gửi thắc mắc hoặc yêu cầu báo giá – đội ngũ tư vấn sẽ
          phản hồi trong vòng 24h.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Gửi liên hệ ngay
        </Button>
      </Box>
    </Box>
  );
};

export default ContactHeroSection;
