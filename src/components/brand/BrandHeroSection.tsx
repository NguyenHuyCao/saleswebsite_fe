"use client";

import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

const HeroContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "65vh",
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
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    height: "50vh",
    padding: theme.spacing(2),
  },
}));

const Overlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.2))",
  zIndex: 1,
});

const ContentBox = styled(motion(Box))(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  maxWidth: 800,
  padding: theme.spacing(2),
  color: "#fff",
}));

const BrandHeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <HeroContainer>
      <Overlay />

      <ContentBox
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={700}
            mb={2}
            sx={{
              textShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            Chúng tôi phân phối chính thức từ các thương hiệu hàng đầu
          </Typography>

          <Typography
            variant="body1"
            mb={3}
            sx={{ maxWidth: 600, mx: "auto", opacity: 0.9 }}
          >
            100% hàng chính hãng – Nhập khẩu trực tiếp – Bảo hành toàn quốc
          </Typography>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="secondary"
              href="#brand-list"
              size="large"
              endIcon={<KeyboardDoubleArrowDownIcon />}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                px: 4,
                bgcolor: "#ffb700",
                color: "#000",
                "&:hover": {
                  bgcolor: "#f59e0b",
                },
              }}
            >
              Xem danh sách thương hiệu
            </Button>
          </motion.div>
        </motion.div>
      </ContentBox>
    </HeroContainer>
  );
};

export default BrandHeroSection;
