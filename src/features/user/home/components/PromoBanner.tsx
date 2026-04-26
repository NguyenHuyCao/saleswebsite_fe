"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";

// Icons
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function PromoBanner() {
  const router = useRouter();
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Countdown timer (giả sử còn 3 ngày)
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, delay: 0.3 },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "#000",
            position: "relative",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <Grid container>
            {/* Left - Content */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                position: "relative",
                minHeight: { xs: 320, sm: 380, md: 450 },
                backgroundImage:
                  "linear-gradient(135deg, #000 0%, #1a1a1a 100%)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1,
                  background:
                    "radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%)",
                }}
              />

              <motion.div variants={textVariants} style={{ width: "100%" }}>
                <Box
                  sx={{
                    p: { xs: 2.5, sm: 3.5, md: 6 },
                    color: "#fff",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {/* Badges */}
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    <Chip
                      icon={<FlashOnIcon />}
                      label="FLASH SALE"
                      size="small"
                      sx={{
                        bgcolor: "#f25c05",
                        color: "#000",
                        fontWeight: 700,
                      }}
                    />
                    <Chip
                      icon={<LocalOfferIcon />}
                      label="GIẢM 35%"
                      size="small"
                      sx={{
                        bgcolor: "#ffb700",
                        color: "#000",
                        fontWeight: 700,
                      }}
                    />
                  </Stack>

                  {/* Title */}
                  <Typography
                    component="h2"
                    variant="h3"
                    fontWeight={900}
                    sx={{
                      mb: 1,
                      fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.5rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    KHUYẾN MÃI
                  </Typography>
                  <Typography
                    component="h3"
                    variant="h4"
                    sx={{
                      mb: 2,
                      color: "#ffb700",
                      fontWeight: 700,
                      fontSize: { xs: "1.1rem", sm: "1.5rem", md: "2rem" },
                    }}
                  >
                    Pin DEWALT Chính Hãng
                  </Typography>

                  {/* Price */}
                  <Stack
                    direction="row"
                    alignItems="baseline"
                    spacing={2}
                    sx={{ mb: 3 }}
                  >
                    <Typography
                      component="p"
                      variant="h3"
                      sx={{
                        color: "#ffb700",
                        fontWeight: 900,
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      }}
                    >
                      1.550.000₫
                    </Typography>
                    <Typography
                      component="p"
                      variant="h6"
                      sx={{
                        color: "#999",
                        textDecoration: "line-through",
                      }}
                    >
                      2.380.000₫
                    </Typography>
                  </Stack>

                  {/* Countdown Timer */}
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 3,
                      p: 2,
                      mb: 3,
                      maxWidth: 400,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <AccessTimeIcon sx={{ color: "#ffb700", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "#fff" }}>
                        Kết thúc sau:
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      {[
                        { value: timeLeft.days, label: "Ngày" },
                        { value: timeLeft.hours, label: "Giờ" },
                        { value: timeLeft.minutes, label: "Phút" },
                        { value: timeLeft.seconds, label: "Giây" },
                      ].map((item) => (
                        <Box key={item.label} sx={{ textAlign: "center" }}>
                          <Typography
                            component="p"
                            variant="h5"
                            fontWeight={700}
                            sx={{ color: "#ffb700" }}
                          >
                            {String(item.value).padStart(2, "0")}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            {item.label}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>

                  {/* Features */}
                  <Stack direction="row" spacing={1} sx={{ mb: { xs: 3, md: 4 }, flexWrap: "wrap", rowGap: 1 }}>
                    {[
                      "Bảo hành 12 tháng",
                      "Miễn phí ship",
                      "Đổi trả 7 ngày",
                    ].map((feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.1)",
                          color: "#fff",
                          fontSize: "0.7rem",
                        }}
                      />
                    ))}
                  </Stack>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push("/product?brand=dewalt")}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: "#ffb700",
                        color: "#000",
                        fontWeight: 700,
                        px: { xs: 2.5, md: 4 },
                        py: { xs: 1, md: 1.5 },
                        borderRadius: 3,
                        textTransform: "none",
                        fontSize: { xs: "0.9rem", md: "1.1rem" },
                        "&:hover": {
                          bgcolor: "#c94000",
                          color: "#fff",
                        },
                      }}
                    >
                      Xem ngay - Số lượng có hạn
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>

            {/* Right - Image */}
            <Grid
              size={{ md: 6 }}
              sx={{
                position: "relative",
                display: { xs: "none", md: "block" },
                minHeight: 450,
                overflow: "hidden",
              }}
            >
              <motion.div
                variants={imageVariants}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url(/images/banner/imagesbanner.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "transform 8s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />

                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
                  }}
                />

                {/* Price Tag */}
                <motion.div

                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  style={{
                    position: "absolute",
                    top: 30,
                    right: 30,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      bgcolor: "#f25c05",
                      color: "#000",
                      p: 2,
                      borderRadius: "50%",
                      width: 100,
                      height: 100,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "rotate(5deg)",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      GIẢM
                    </Typography>
                    <Typography
                      component="p"
                      variant="h4"
                      fontWeight={900}
                      sx={{ lineHeight: 1 }}
                    >
                      35%
                    </Typography>
                  </Paper>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>

          {/* Mobile Image (chỉ hiện trên mobile) */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              height: 200,
              backgroundImage: "url(/images/banner/imagesbanner.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
              }}
            />
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
}
