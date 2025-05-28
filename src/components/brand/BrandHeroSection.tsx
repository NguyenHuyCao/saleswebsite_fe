"use client";

import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

const HeroContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "60vh",
  backgroundImage:
    "url(/images/brands/6670636fbeca91b81a58a6f9_Deere-company-tractor-banner.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "white",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    height: "50vh",
  },
}));

const Overlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1,
});

const ContentBox = styled(motion(Box))(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  maxWidth: 800,
  padding: theme.spacing(2),
}));

const BrandHeroSection = () => {
  return (
    <HeroContainer>
      <Overlay />
      <ContentBox
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Chúng tôi phân phối chính thức từ các thương hiệu hàng đầu
        </Typography>
        <Typography variant="body1" mb={3}>
          100% hàng chính hãng – Nhập khẩu trực tiếp – Bảo hành toàn quốc
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="#brand-list"
          size="large"
        >
          Xem danh sách thương hiệu
        </Button>
      </ContentBox>
    </HeroContainer>
  );
};

export default BrandHeroSection;
