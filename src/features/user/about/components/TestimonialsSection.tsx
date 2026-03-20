// about/components/TestimonialsSection.tsx
"use client";

import React from "react";
import Slider from "react-slick";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Rating,
  Chip,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import VerifiedIcon from "@mui/icons-material/Verified";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { testimonials } from "../constants/testimonials";

export default function TestimonialsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <Box py={6} px={{ xs: 2, sm: 4 }} sx={{ bgcolor: "#fffaf0" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip
          label="KHÁCH HÀNG NÓI GÌ"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />

        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            mb: 2,
          }}
        >
          Ý kiến{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            khách hàng
          </Box>
        </Typography>
      </Box>

      <Slider {...settings}>
        {testimonials.map((t, i) => (
          <Box key={i} px={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "all 0.3s",
                  background: "#fff",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                  },
                }}
              >
                {/* Quote Icon */}
                <FormatQuoteIcon
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    fontSize: 40,
                    color: "#ffb700",
                    opacity: 0.2,
                  }}
                />

                {/* Header */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar
                    src={t.avatar}
                    alt={t.name}
                    sx={{ width: 64, height: 64, border: "3px solid #ffb700" }}
                  />
                  <Box>
                    <Typography fontWeight={700}>{t.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.job}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ mt: 0.5 }}
                    >
                      <Rating value={t.rating} readOnly size="small" />
                      {t.verified && (
                        <Chip
                          icon={<VerifiedIcon sx={{ fontSize: 12 }} />}
                          label="Đã xác minh"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.5rem",
                            bgcolor: "#4caf50",
                            color: "#fff",
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>

                {/* Comment */}
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  “{t.comment}”
                </Typography>

                {/* Date */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: "block", textAlign: "right" }}
                >
                  {t.date}
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
