"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Marquee from "react-fast-marquee";
import Image from "next/image";

interface Props {
  brands: string[];
}

const FeaturedBrandsSlider = ({ brands }: Props) => {
  return (
    <Box sx={{ px: 3, py: 6, bgcolor: "#fff", textAlign: "center" }}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        THƯƠNG HIỆU{" "}
        <Box component="span" sx={{ color: "#ffb700" }}>
          NỔI BẬT
        </Box>
      </Typography>

      <Box
        sx={{
          overflow: "hidden",
          "& .marquee-container": {
            overflowY: "hidden !important", // Ngăn scroll Y
          },
        }}
      >
        <Marquee
          pauseOnHover
          gradient={false}
          speed={40}
          className="marquee-container"
        >
          {brands.map((logo, index) => (
            <Box
              key={index}
              sx={{
                mx: 4,
                width: 120,
                height: 60,
                position: "relative",
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
              <Image
                src={logo}
                alt={`brand-${index}`}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 600px) 100px, 120px"
              />
            </Box>
          ))}
        </Marquee>
      </Box>
    </Box>
  );
};

export default FeaturedBrandsSlider;
