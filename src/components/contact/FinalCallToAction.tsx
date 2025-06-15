"use client";

import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const FinalCallToAction = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const handleContact = () => {
    router.push("/contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShop = () => {
    router.push("/product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      sx={{
        position: "relative",
        width: "100%",
        height: isMobile ? 280 : 400,
        mt: 8,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
      }}
    >
      {/* Background image */}
      <Image
        src="/images/banner/pngtree-an-orange-lawn-mower-parked-in-the-grass-image_2919945.jpg"
        alt="CTA Background"
        fill
        style={{ objectFit: "cover", zIndex: 1 }}
        priority
      />

      {/* Overlay & Content */}
      <Box
        component={motion.div}
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
        sx={{
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          maxWidth: 740,
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={2}>
          CHỌN ĐÚNG THƯƠNG HIỆU – TĂNG HIỆU QUẢ CÔNG VIỆC NGAY HÔM NAY
        </Typography>
        <Typography fontSize={16} mb={3}>
          Đừng bỏ lỡ cơ hội nhận ưu đãi cực sốc & hỗ trợ tư vấn tận tâm từ đội
          ngũ của chúng tôi
        </Typography>
        <Box
          display="flex"
          gap={2}
          justifyContent="center"
          flexWrap="wrap"
          mt={2}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleContact}
            sx={{
              bgcolor: "#f25c05",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
              "&:hover": {
                bgcolor: "#d14c02",
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Liên hệ tư vấn
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleShop}
            sx={{
              color: "white",
              borderColor: "white",
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Mua ngay – Ưu đãi cực sốc!
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FinalCallToAction;
