"use client";

import React from "react";
import { Box, Typography, Grid, Paper, Button, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const brands = [
  {
    logo: "/images/brands/images.png",
    name: "Makita",
    origin: "Nhật Bản",
    category: "Công trình, sửa chữa",
    link: "/product?brand=makita",
  },
  {
    logo: "/images/brands/Stihl_Logo_WhiteOnOrange.svg.png",
    name: "Stihl",
    origin: "Đức",
    category: "Nông nghiệp, lâm nghiệp",
    link: "/product?brand=stihl",
  },
  {
    logo: "/images/brands/TGPT Husqvarna.jpg",
    name: "Husqvarna",
    origin: "Thụy Điển",
    category: "Làm vườn, lâm nghiệp",
    link: "/product?brand=husqvarna",
  },
];

const BrandListSection = () => {
  const router = useRouter();

  return (
    <Box px={4} py={8} bgcolor="#f9fafb">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={6}
        color="primary"
      >
        DANH SÁCH THƯƠNG HIỆU
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {brands.map((brand, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                height: "100%",
                textAlign: "center",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                  "& .logo": {
                    transform: "scale(1.1)",
                  },
                  "&::after": {
                    opacity: 1,
                  },
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "40%",
                  background:
                    "radial-gradient(circle at bottom, #ffeb3b33, transparent)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  zIndex: 0,
                },
              }}
            >
              <Box mb={2} position="relative" zIndex={1}>
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={100}
                  height={60}
                  className="logo"
                  style={{
                    transition: "transform 0.3s ease",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                fontWeight="bold"
                mb={1}
                zIndex={1}
                position="relative"
              >
                {brand.name}
              </Typography>
              <Typography fontSize={14} color="text.secondary" mb={0.5}>
                Quốc gia: {brand.origin}
              </Typography>
              <Typography fontSize={14} color="text.secondary" mb={2}>
                Lĩnh vực: {brand.category}
              </Typography>
              <Stack alignItems="center">
                <Button
                  variant="outlined"
                  sx={{ mt: 1, zIndex: 1, position: "relative" }}
                  onClick={() => router.push(brand.link)}
                >
                  Xem sản phẩm
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BrandListSection;
