"use client";

import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const WarrantyPageHero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: isMobile ? 300 : 440,
        px: { xs: 2, md: 4 },
        py: { xs: 6, md: 10 },
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#e3f2fd",
        borderRadius: 3,
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          "& img": { filter: "blur(1px)", opacity: 0.15 },
        }}
      >
        <Image
          src="/images/warranty/technician.jpg"
          alt="Bảo hành kỹ thuật"
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
        />
      </Box>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: 700,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          mb={2}
          fontSize={{ xs: 22, md: 32 }}
        >
          Bảo hành nhanh chóng – An tâm sử dụng
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          mb={4}
          fontSize={{ xs: 14, md: 16 }}
        >
          Theo dõi bảo hành sản phẩm bạn đã mua – minh bạch, chính xác và thuận
          tiện!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ textTransform: "none", fontWeight: 600 }}
          href="#warranty-check"
        >
          Tra cứu bảo hành
        </Button>
      </motion.div>
    </Box>
  );
};

export default WarrantyPageHero;
