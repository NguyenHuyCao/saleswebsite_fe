"use client";

import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const promos = ["Giảm 20% đơn đầu", "Miễn phí vận chuyển", "Bảo hành 12 tháng"];

export default function FinalCallToAction() {
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
        // Không dùng fixed height — để nội dung tự quyết định chiều cao
        py: { xs: 5, md: 8 },
        px: { xs: 2, sm: 4 },
        my: { xs: 4, md: 8 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        // Background qua CSS để không bị ràng buộc height như next/image fill
        backgroundImage:
          "url('/images/banner/pngtree-an-orange-lawn-mower-parked-in-the-grass-image_2919945.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(242,92,5,0.92) 0%, rgba(255,183,0,0.85) 100%)",
          zIndex: 0,
        }}
      />

      {/* Card nội dung */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 700,
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.97)",
            borderRadius: { xs: 3, md: 4 },
            p: { xs: "24px 20px", sm: 4, md: 5 },
            textAlign: "center",
            boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          }}
        >
          {/* Badge ưu đãi */}
          <Chip
            icon={<LocalOfferIcon sx={{ fontSize: "1rem !important" }} />}
            label="Ưu đãi đặc biệt"
            sx={{
              bgcolor: "#f25c05",
              color: "#fff",
              fontWeight: 700,
              mb: 2,
              fontSize: "0.82rem",
            }}
          />

          {/* Tiêu đề — sentence case, xuống dòng hợp lý trên mobile */}
          <Typography
            component="h2"
            fontWeight={900}
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.55rem", md: "1.9rem" },
              lineHeight: 1.3,
              mb: 1.5,
              color: "#1a1a1a",
            }}
          >
            Chọn đúng thương hiệu
            <Box
              component="span"
              sx={{
                color: "#f25c05",
                display: "block",
                fontSize: { xs: "1.15rem", sm: "1.45rem", md: "1.8rem" },
              }}
            >
              — Tăng hiệu quả công việc
            </Box>
          </Typography>

          {/* Mô tả */}
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: "#555",
              maxWidth: 480,
              mx: "auto",
              fontSize: { xs: "0.87rem", md: "0.97rem" },
              lineHeight: 1.65,
            }}
          >
            Đừng bỏ lỡ ưu đãi cực sốc & hỗ trợ tư vấn tận tâm
            từ đội ngũ chuyên nghiệp của chúng tôi.
          </Typography>

          {/* Promo chips — luôn wrap đều trên mọi kích thước */}
          <Stack
            direction="row"
            justifyContent="center"
            flexWrap="wrap"
            sx={{ gap: 1, mb: 3.5 }}
          >
            {promos.map((p) => (
              <Chip
                key={p}
                icon={
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: "15px !important", color: "#f25c05 !important" }}
                  />
                }
                label={p}
                size="small"
                sx={{
                  bgcolor: "#fff4eb",
                  color: "#d44d00",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  border: "1px solid rgba(242,92,5,0.2)",
                  px: 0.5,
                }}
              />
            ))}
          </Stack>

          {/* Buttons — full-width trên mobile, auto trên sm+ */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
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
                px: { xs: 3, md: 4 },
                py: 1.4,
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.92rem", md: "1rem" },
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(242,92,5,0.4)",
                "&:hover": {
                  bgcolor: "#e64a19",
                  boxShadow: "0 6px 20px rgba(242,92,5,0.5)",
                },
                transition: "all 0.2s ease",
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
                px: { xs: 3, md: 4 },
                py: 1.4,
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.92rem", md: "1rem" },
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#e64a19",
                  bgcolor: "rgba(242,92,5,0.06)",
                },
                transition: "all 0.2s ease",
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
