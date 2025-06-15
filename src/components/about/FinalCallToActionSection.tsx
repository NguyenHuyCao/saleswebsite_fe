"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles"; // ✅ Đã sửa
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/images/banner/images (4).jpeg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  padding: theme.spacing(10, 4),
  textAlign: "center",
  color: "#fff",
  position: "relative",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: theme.shadows[6],

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2))",
    zIndex: 1,
  },
}));

const ContentBox = styled(motion.div)({
  position: "relative",
  zIndex: 2,
});

const FinalCallToActionSection = () => {
  const router = useRouter();

  return (
    <Box px={{ xs: 2, sm: 4 }} py={6}>
      <BackgroundBox>
        <ContentBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: 24, sm: 32 },
              lineHeight: 1.4,
            }}
          >
            Sẵn sàng bứt phá cùng{" "}
            <Box component="span" sx={{ color: "#ffb700" }}>
              Máy 2 thì
            </Box>
            ?
          </Typography>
          <Typography
            variant="subtitle1"
            mb={4}
            sx={{ fontSize: { xs: 14, sm: 18 } }}
          >
            Chất lượng – Giá tốt – Hậu mãi trọn đời!
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
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: "#ffb700",
                color: "#000",
                "&:hover": {
                  backgroundColor: "#ffc107",
                },
              }}
              onClick={() => router.push("/contact")}
            >
              Liên hệ tư vấn
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                borderColor: "#fff",
                color: "#fff",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
              onClick={() => router.push("/product")}
            >
              Mua ngay hôm nay – Ưu đãi cực sốc!
            </Button>
          </Stack>
        </ContentBox>
      </BackgroundBox>
    </Box>
  );
};

export default FinalCallToActionSection;
