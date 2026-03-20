// about/components/FinalCallToActionSection.tsx
"use client";

import { Box, Typography, Button, Stack, Chip, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCtaTracking } from "../hooks/useCtaTracking";

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/images/banner/images (4).jpeg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  padding: theme.spacing(10, 4),
  textAlign: "center",
  color: "#fff",
  position: "relative",
  borderRadius: theme.spacing(3),
  overflow: "hidden",
  boxShadow: theme.shadows[6],
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(242,92,5,0.9) 0%, rgba(255,183,0,0.8) 100%)",
    zIndex: 1,
  },
}));

const ContentBox = styled(motion.div)({ position: "relative", zIndex: 2 });

export default function FinalCallToActionSection() {
  const router = useRouter();
  const track = useCtaTracking();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <BackgroundBox>
        <ContentBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Chip
            label="SẴN SÀNG TRẢI NGHIỆM?"
            sx={{ bgcolor: "#fff", color: "#f25c05", fontWeight: 700, mb: 3 }}
          />

          <Typography
            variant="h3"
            fontWeight={900}
            gutterBottom
            sx={{ fontSize: { xs: 28, sm: 36, md: 42 }, lineHeight: 1.4 }}
          >
            Sẵn sàng bứt phá cùng{" "}
            <Box component="span" sx={{ color: "#ffb700" }}>
              Máy 2 thì
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.95, fontSize: { xs: 16, sm: 18 } }}
          >
            Chất lượng – Giá tốt – Hậu mãi trọn đời!
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: "#ffb700",
                  color: "#000",
                  "&:hover": { bgcolor: "#ffa000" },
                }}
                onClick={() => {
                  track("about_cta_contact");
                  router.push("/contact");
                }}
              >
                Liên hệ tư vấn
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  borderColor: "#fff",
                  color: "#fff",
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "#ffb700",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
                onClick={() => {
                  track("about_cta_buy_now");
                  router.push("/product");
                }}
              >
                Mua ngay – Ưu đãi cực sốc!
              </Button>
            </motion.div>
          </Stack>
        </ContentBox>
      </BackgroundBox>
    </Container>
  );
}
