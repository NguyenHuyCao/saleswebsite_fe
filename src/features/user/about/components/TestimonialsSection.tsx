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
    <Box py={6} sx={{ bgcolor: "#fffaf0", mx: { xs: -2, sm: -3, md: -3 }, px: { xs: 2, sm: 3, md: 3 } }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip
          label="KHÁCH HÀNG NÓI GÌ"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
        >
          Ý kiến{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            khách hàng
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: "auto" }}>
          Hàng nghìn khách hàng đã tin tưởng chọn Cường Hoa — đây là những gì họ nói.
        </Typography>
      </Box>

      <Slider {...settings}>
        {testimonials.map((t, i) => (
          <Box key={i} px={1.5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                minHeight: 260,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                border: "1px solid #f0f0f0",
                bgcolor: "#fff",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(242,92,5,0.12)",
                  borderColor: "#f5e0d0",
                },
              }}
            >
              <FormatQuoteIcon
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontSize: 36,
                  color: "#ffb700",
                  opacity: 0.25,
                }}
              />

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar
                  src={t.avatar}
                  alt={t.name}
                  sx={{ width: 56, height: 56, border: "2px solid #ffb700", bgcolor: "#f25c05" }}
                />
                <Box>
                  <Typography fontWeight={700} variant="body2">{t.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{t.job}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                    <Rating value={t.rating} readOnly size="small" />
                    {t.verified && (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: 11 }} />}
                        label="Đã xác minh"
                        size="small"
                        sx={{ height: 17, fontSize: "0.5rem", bgcolor: "#4caf50", color: "#fff" }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>

              <Typography
                variant="body2"
                color="text.primary"
                sx={{ lineHeight: 1.65, fontStyle: "italic", flex: 1 }}
              >
                "{t.comment}"
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block", textAlign: "right" }}
              >
                {t.date}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
