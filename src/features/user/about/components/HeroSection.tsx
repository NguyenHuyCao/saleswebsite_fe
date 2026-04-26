"use client";

import { Box, Typography, Button, Stack, Chip, Grid } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCtaTracking } from "../hooks/useCtaTracking";
import { companyStats } from "../constants/features";
import PhoneIcon from "@mui/icons-material/Phone";

export default function HeroSection() {
  const router = useRouter();
  const track = useCtaTracking();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "70vh", md: "80vh" },
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        bgcolor: "#000",
      }}
    >
      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUpDelay1 {
          0%,20% { opacity: 0; transform: translateY(20px); }
          100%   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUpDelay2 {
          0%,35% { opacity: 0; transform: translateY(20px); }
          100%   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUpDelay3 {
          0%,50% { opacity: 0; transform: translateY(16px); }
          100%   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background with slow zoom */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          animation: "heroZoom 14s ease-in-out infinite alternate",
        }}
      >
        <Image
          src="/images/about/business-cogs-technology-background-banner-computer-circuits-56974243.webp"
          alt="Cường Hoa — Máy công cụ 2 thì chính hãng"
          fill
          priority
          style={{ objectFit: "cover", filter: "brightness(0.55)" }}
        />
      </Box>

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.28) 100%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: "lg",
          mx: "auto",
          px: { xs: 2.5, sm: 4, md: 6 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ animation: "fadeUp 0.8s ease both" }}>
              <Chip
                label="CƯỜNG HOA — MÁY CÔNG CỤ 2 THÌ"
                sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 3, fontSize: "0.75rem" }}
              />

              <Typography
                variant="h1"
                fontWeight={900}
                sx={{
                  color: "#fff",
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  mb: 2,
                  animation: "fadeUpDelay1 1s ease both",
                }}
              >
                Chất lượng bền bỉ từ{" "}
                <Box component="span" sx={{ color: "#ffb700" }}>
                  động cơ 2 thì
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  mb: 1.5,
                  fontSize: { xs: "1rem", sm: "1.2rem" },
                  animation: "fadeUpDelay2 1.1s ease both",
                }}
              >
                Sức mạnh đích thực — Từ việc nhẹ đến công trình nặng!
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 4,
                  animation: "fadeUpDelay2 1.1s ease both",
                }}
              >
                Hơn 5 năm phân phối chính hãng tại Bắc Ninh · 10.000+ khách hàng tin dùng
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 5, animation: "fadeUpDelay3 1.2s ease both" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    track("about_hero_view_products");
                    router.push("/product");
                  }}
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2.5,
                    fontSize: "1rem",
                    "&:hover": { bgcolor: "#ffa000", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(255,183,0,0.35)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  Xem sản phẩm
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PhoneIcon />}
                  href="tel:0392923392"
                  sx={{
                    borderColor: "rgba(255,255,255,0.7)",
                    color: "#fff",
                    borderWidth: 2,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2.5,
                    fontSize: "1rem",
                    "&:hover": { borderColor: "#ffb700", bgcolor: "rgba(255,255,255,0.08)" },
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => track("about_hero_phone_click")}
                >
                  0392 923 392
                </Button>
              </Stack>

              {/* Company Stats */}
              <Grid
                container
                spacing={2}
                sx={{ animation: "fadeUpDelay3 1.3s ease both" }}
              >
                {companyStats.map((stat, idx) => (
                  <Grid key={idx} size={{ xs: 6, sm: 3 }}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 1.5,
                        px: 1,
                        bgcolor: "rgba(255,255,255,0.08)",
                        borderRadius: 2,
                        border: "1px solid rgba(255,255,255,0.12)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <Typography variant="h4" fontWeight={800} color="#ffb700" sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right — scroll down hint on desktop */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 400,
                height: 380,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
                border: "2px solid rgba(255,183,0,0.3)",
                animation: "fadeUpDelay2 1s ease both",
              }}
            >
              <Image
                src="/images/about/4D-Leadership-approach.png"
                alt="Đội ngũ Cường Hoa"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: { xs: "none", md: "block" },
          animation: "fadeUp 1.5s ease both",
        }}
      >
        <Box
          onClick={() => document.getElementById("who-we-are")?.scrollIntoView({ behavior: "smooth" })}
          sx={{
            width: 28,
            height: 44,
            border: "2px solid rgba(255,255,255,0.4)",
            borderRadius: 14,
            display: "flex",
            justifyContent: "center",
            pt: 1,
            cursor: "pointer",
            "&::after": {
              content: '""',
              display: "block",
              width: 4,
              height: 8,
              bgcolor: "rgba(255,255,255,0.7)",
              borderRadius: 2,
              animation: "scrollDot 1.6s ease infinite",
            },
            "@keyframes scrollDot": {
              "0%,100%": { transform: "translateY(0)", opacity: 1 },
              "50%": { transform: "translateY(10px)", opacity: 0.3 },
            },
          }}
        />
      </Box>
    </Box>
  );
}
