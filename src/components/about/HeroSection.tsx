"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "80vh", md: "100vh" },
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#000",
      }}
    >
      {/* Background image with parallax effect */}
      <Box
        component={motion.div}
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.05 }}
        transition={{ duration: 10, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Image
          src="/images/about/business-cogs-technology-background-banner-computer-circuits-56974243.webp"
          alt="Máy 2 thì hoạt động"
          fill
          priority
          style={{ objectFit: "cover", filter: "brightness(0.7)" }}
        />
      </Box>

      {/* Overlay content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          color: "white",
          px: 2,
          maxWidth: 800,
        }}
      >
        <Typography
          variant="h2"
          component={motion.h1}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          fontWeight="bold"
          mb={2}
        >
          Chất lượng bền bỉ từ động cơ 2 thì
        </Typography>

        <Typography
          variant="h6"
          component={motion.p}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          mb={4}
        >
          Sức mạnh đích thực – Từ công việc nhẹ đến công việc nặng!
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="warning"
            size="large"
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/product")}
          >
            Xem sản phẩm
          </Button>
          <Button
            variant="outlined"
            color="warning"
            size="large"
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tại sao chọn máy 2 thì?
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HeroSection;
