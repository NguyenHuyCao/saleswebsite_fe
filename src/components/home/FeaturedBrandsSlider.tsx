"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Marquee from "react-fast-marquee";

const brands = [
  "/images/brands/images.png",
  "/images/brands/Stihl_Logo_WhiteOnOrange.svg.png",
  "/images/brands/TGPT Husqvarna.jpg",
  "/images/brands/thuong-hieu-makita-cua-nuoc-nao-co-nhung-san-pham-nao-3.jpg",
  "/images/brands/images.png",
  "/images/brands/Stihl_Logo_WhiteOnOrange.svg.png",
  "/images/brands/TGPT Husqvarna.jpg",
  "/images/brands/thuong-hieu-makita-cua-nuoc-nao-co-nhung-san-pham-nao-3.jpg",
];

const FeaturedBrandsSlider = () => {
  return (
    <Box sx={{ px: 3, py: 6, bgcolor: "#fff", textAlign: "center" }}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        THƯƠNG HIỆU{" "}
        <Box component="span" sx={{ color: "#ffb700" }}>
          NỔI BẬT
        </Box>
      </Typography>

      <Box sx={{ overflow: "hidden" }}>
        <Marquee
          pauseOnHover
          gradient={false}
          speed={40}
          style={{
            display: "flex",
            alignItems: "center",
            overflowY: "hidden", // ✨ Ngăn cuộn dọc
            scrollbarWidth: "none", // Firefox
          }}
        >
          {brands.map((logo, index) => (
            <Box
              key={index}
              sx={{
                mx: 4,
                width: 120,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease",
                filter: "grayscale(100%)",
                "&:hover": {
                  transform: "scale(1.1)",
                  filter: "grayscale(0%)",
                },
              }}
            >
              <img
                src={logo}
                alt={`brand-${index}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  display: "block", // tránh inline-element overflow
                }}
              />
            </Box>
          ))}
        </Marquee>
      </Box>
    </Box>
  );
};

export default FeaturedBrandsSlider;
