"use client";

import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Stack,
  Chip,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function FinalCallToAction() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const go = (href: string) => {
    router.push(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: isMobile ? 350 : 450,
        my: 8,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
      }}
    >
      <Image
        src="/images/banner/pngtree-an-orange-lawn-mower-parked-in-the-grass-image_2919945.jpg"
        alt="CTA Background"
        fill
        style={{ objectFit: "cover", zIndex: 1 }}
        priority
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(242,92,5,0.9) 0%, rgba(255,183,0,0.8) 100%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: 800,
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          {/* Badge */}
          <Chip
            icon={<LocalOfferIcon />}
            label="Ưu đãi đặc biệt"
            sx={{
              bgcolor: "#f25c05",
              color: "#fff",
              fontWeight: 700,
              mb: 2,
            }}
          />

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              mb: 2,
              color: "#333",
            }}
          >
            CHỌN ĐÚNG THƯƠNG HIỆU – TĂNG HIỆU QUẢ CÔNG VIỆC
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 3, color: "#666", maxWidth: 600, mx: "auto" }}
          >
            Đừng bỏ lỡ cơ hội nhận ưu đãi cực sốc & hỗ trợ tư vấn tận tâm từ đội
            ngũ chuyên nghiệp của chúng tôi
          </Typography>

          {/* Promo Chips */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}
          >
            <Chip label="Giảm 20% đơn đầu" size="small" />
            <Chip label="Miễn phí vận chuyển" size="small" />
            <Chip label="Bảo hành 12 tháng" size="small" />
          </Stack>

          {/* Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => go("/contact")}
              endIcon={<SupportAgentIcon />}
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#e64a19",
                  transform: "scale(1.05)",
                },
              }}
            >
              Tư vấn miễn phí
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => go("/product")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderColor: "#f25c05",
                borderWidth: 2,
                color: "#f25c05",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                "&:hover": {
                  borderColor: "#e64a19",
                  bgcolor: "rgba(242,92,5,0.05)",
                  transform: "scale(1.05)",
                },
              }}
            >
              Khám phá sản phẩm
            </Button>
          </Stack>
        </Box>
      </motion.div>
    </Box>
  );
}
