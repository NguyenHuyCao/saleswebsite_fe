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
} from "@mui/material";
import { motion } from "framer-motion";
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
  };

  return (
    <Box py={6} px={{ xs: 2, sm: 4 }} bgcolor="#fffaf0">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        sx={{ color: "#000", "& span": { color: "#ffb700" } }}
      >
        Ý KIẾN <span>KHÁCH HÀNG</span>
      </Typography>
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
                  borderRadius: 3,
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.3s",
                  background: "#fff",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={t.avatar}
                    alt={`Ảnh đại diện ${t.name}`}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography fontWeight={600}>{t.name}</Typography>
                    <Typography fontSize={14} color="text.secondary">
                      {t.job}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  fontSize={15}
                  fontStyle="italic"
                  color="text.primary"
                >
                  “{t.comment}”
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
