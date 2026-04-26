"use client";

import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

const HeroContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "80vh",
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
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    height: "55vh",
    padding: theme.spacing(2),
  },
}));

export default function BrandHeroSection() {
  return (
    <>
      <style>{`
        @keyframes brandHeroFadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <HeroContainer>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.15))",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: 820,
            px: { xs: 1, sm: 2 },
            color: "#fff",
            animation: "brandHeroFadeUp 0.75s ease forwards",
          }}
        >
          <Typography
            fontWeight={800}
            mb={2}
            sx={{
              fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.4rem" },
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              lineHeight: 1.25,
            }}
          >
            Cường Hoa phân phối chính thức
            <br />
            từ các thương hiệu máy công cụ hàng đầu
          </Typography>

          <Typography
            variant="body1"
            mb={3}
            sx={{
              maxWidth: 560,
              mx: "auto",
              opacity: 0.92,
              fontSize: { xs: "0.9rem", md: "1.05rem" },
            }}
          >
            100% hàng chính hãng – Nhập khẩu trực tiếp – Bảo hành toàn quốc
          </Typography>

          <Button
            variant="contained"
            href="#brand-list"
            size="large"
            endIcon={<KeyboardDoubleArrowDownIcon />}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              px: { xs: 3, md: 4.5 },
              py: 1.3,
              bgcolor: "#ffb700",
              color: "#000",
              fontSize: { xs: "0.9rem", md: "1rem" },
              boxShadow: "0 4px 16px rgba(255,183,0,0.35)",
              "&:hover": { bgcolor: "#f59e0b" },
            }}
          >
            Xem danh sách thương hiệu
          </Button>
        </Box>
      </HeroContainer>
    </>
  );
}
