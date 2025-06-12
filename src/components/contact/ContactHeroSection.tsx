"use client";

import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const ContactHeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "70vh", md: "80vh" },
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Image
        src="/images/banner/360_F_229670001_Ju6K5ezKiyJphkwj316zT31XifNHJoPT.jpg"
        alt="Team working"
        fill
        priority
        style={{ objectFit: "cover", zIndex: 0 }}
      />

      {/* Overlay Gradient */}
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

      {/* Content */}
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
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          sx={{ fontSize: { xs: "1.75rem", sm: "2.2rem", md: "2.8rem" } }}
        >
          Chúng tôi luôn sẵn sàng hỗ trợ bạn!
        </Typography>

        <Typography
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          mb={4}
          sx={{
            fontSize: { xs: "1rem", md: "1.125rem" },
            maxWidth: 720,
            mx: "auto",
            color: "#e0e0e0",
          }}
        >
          Đừng ngần ngại gửi thắc mắc hoặc yêu cầu báo giá – đội ngũ tư vấn của
          chúng tôi sẽ phản hồi trong vòng 24h.
        </Typography>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="contained"
            color="warning"
            size="large"
            sx={{
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#f57c00",
              },
            }}
            href="#contact-form"
          >
            Gửi liên hệ ngay
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ContactHeroSection;
