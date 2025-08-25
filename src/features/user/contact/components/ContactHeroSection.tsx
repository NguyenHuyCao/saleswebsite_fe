"use client";

import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ContactHeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "70vh", md: "80vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Image
        src="/images/banner/360_F_229670001_Ju6K5ezKiyJphkwj316zT31XifNHJoPT.jpg"
        alt="Team working"
        fill
        priority
        style={{ objectFit: "cover", zIndex: 0 }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2))",
          backdropFilter: "blur(1px)",
          zIndex: 1,
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
          px: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={2}
          sx={{ fontSize: { xs: "1.75rem", sm: "2.2rem", md: "2.8rem" } }}
        >
          Chúng tôi luôn sẵn sàng hỗ trợ bạn!
        </Typography>
        <Typography
          mb={4}
          sx={{
            fontSize: { xs: "1rem", md: "1.125rem" },
            maxWidth: 720,
            mx: "auto",
            color: "#e0e0e0",
          }}
        >
          Đừng ngần ngại gửi thắc mắc hoặc yêu cầu báo giá – đội ngũ tư vấn sẽ
          phản hồi trong 24h.
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="large"
          href="#contact-form"
          sx={{
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Gửi liên hệ ngay
        </Button>
      </Box>
    </Box>
  );
}
