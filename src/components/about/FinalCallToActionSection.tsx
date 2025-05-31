"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/images/cta/2-stroke-engine-banner.jpg")',
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

const ContentBox = styled(Box)({
  position: "relative",
  zIndex: 2,
});

const FinalCallToActionSection = () => {
  const router = useRouter();

  return (
    <Box px={4} py={6}>
      <BackgroundBox>
        <ContentBox>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Sẵn sàng bứt phá cùng{" "}
            <span style={{ color: "#ffb700" }}>Máy 2 thì</span>?
          </Typography>
          <Typography variant="subtitle1" mb={4}>
            Chất lượng – Giá tốt – Hậu mãi trọn đời!
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
              onClick={() => router.push("/contact")}
            >
              Liên hệ tư vấn
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                borderColor: "#fff",
                color: "#fff",
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
