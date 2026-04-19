// about/components/HeroSection.tsx
"use client";

import { Box, Typography, Button, Stack, Chip, Grid } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCtaTracking } from "../hooks/useCtaTracking";
import { companyStats } from "../constants/features";

export default function HeroSection() {
  const router = useRouter();
  const track = useCtaTracking();

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "60vh", md: "75vh" },
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      {/* Background Image với Parallax */}
      <Box
        component={motion.div}
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        sx={{ position: "absolute", inset: 0, zIndex: 1 }}
      >
        <Image
          src="/images/about/business-cogs-technology-background-banner-computer-circuits-56974243.webp"
          alt="Máy 2 thì hoạt động"
          fill
          priority
          style={{ objectFit: "cover", filter: "brightness(0.6)" }}
        />
      </Box>

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 3 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Chip
                label="CHẤT LƯỢNG BỀN BỈ"
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  mb: 3,
                }}
              />

              <Typography
                variant="h1"
                fontWeight={900}
                sx={{
                  color: "#fff",
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  lineHeight: 1.2,
                  mb: 2,
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
                  mb: 4,
                  maxWidth: 600,
                }}
              >
                Sức mạnh đích thực – Từ công việc nhẹ đến công việc nặng!
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                    "&:hover": { bgcolor: "#ffa000" },
                  }}
                >
                  Xem sản phẩm
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    track("about_hero_why_2t_click");
                    document
                      .getElementById("why-two-stroke")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  sx={{
                    borderColor: "#fff",
                    color: "#fff",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "#ffb700",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Tìm hiểu thêm
                </Button>
              </Stack>

              {/* Company Stats */}
              <Grid container spacing={3}>
                {companyStats.map((stat, idx) => (
                  <Grid key={idx} size={{ xs: 6, sm: 3 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h3"
                          fontWeight={800}
                          color="#ffb700"
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.8)" }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Right Image */}
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 400,
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
              >
                <Image
                  src="/images/about/4D-Leadership-approach.png"
                  alt="About us"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
