"use client";

import { Box, Typography, Button, Stack, Chip, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCtaTracking } from "../hooks/useCtaTracking";

export default function FinalCallToActionSection() {
  const router = useRouter();
  const track = useCtaTracking();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 6 },
          textAlign: "center",
          color: "#fff",
          background: "linear-gradient(135deg, #f25c05 0%, #e03d00 50%, #c43200 100%)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: 'url("/images/banner/images (4).jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Chip
            label="SẴN SÀNG TRẢI NGHIỆM?"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, mb: 3, backdropFilter: "blur(4px)" }}
          />

          <Typography
            variant="h3"
            fontWeight={900}
            gutterBottom
            sx={{ fontSize: { xs: "1.7rem", sm: "2.2rem", md: "2.8rem" }, lineHeight: 1.3 }}
          >
            Sẵn sàng bứt phá cùng{" "}
            <Box component="span" sx={{ color: "#ffb700" }}>
              Cường Hoa?
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{ mb: 1.5, opacity: 0.95, fontSize: { xs: "1rem", sm: "1.1rem" } }}
          >
            Chất lượng – Giá tốt – Hậu mãi trọn đời!
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.8, mb: 4 }}>
            Gọi ngay <strong>0392 923 392</strong> hoặc đến trực tiếp{" "}
            <strong>293 TL293, Nghĩa Phương, Bắc Ninh</strong> để được tư vấn miễn phí.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneIcon />}
              href="tel:0392923392"
              sx={{
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                bgcolor: "#ffb700",
                color: "#000",
                fontSize: "1rem",
                "&:hover": { bgcolor: "#ffa000", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" },
                transition: "all 0.2s ease",
              }}
              onClick={() => track("about_cta_phone")}
            >
              Gọi ngay tư vấn
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingCartIcon />}
              sx={{
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                borderColor: "rgba(255,255,255,0.7)",
                color: "#fff",
                borderWidth: 2,
                fontSize: "1rem",
                "&:hover": {
                  borderColor: "#ffb700",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={() => {
                track("about_cta_buy_now");
                router.push("/product");
              }}
            >
              Xem sản phẩm ngay
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
