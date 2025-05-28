"use client";

import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import Image from "next/image";

const promotions = [
  {
    title: "Khuyến mãi",
    subtitle: "Máy khoan",
    price: "5.590.000đ",
    image: "/images/banner/istockphoto-874289546-612x612.jpg",
    link: "#",
  },
  {
    title: "Khuyến mãi",
    subtitle: "Máy cưa",
    price: "2.920.000đ",
    image: "/images/banner/May-cua-xich-chay-pin-STIHL-MSA-120.jpg",
    link: "#",
  },
];

const PromotionCard = ({ promo }: { promo: (typeof promotions)[0] }) => (
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 2,
      height: { xs: 200, md: 250 },
      cursor: "pointer",
      transition: "transform 0.3s ease",
      "&:hover .image": {
        transform: "scale(1.05)",
      },
      "&:hover .overlay": {
        backgroundColor: "rgba(0,0,0,0.5)",
      },
    }}
  >
    <Box
      className="image"
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        transition: "transform 0.5s ease",
      }}
    >
      <Image
        src={promo.image}
        alt={promo.subtitle}
        fill
        style={{ objectFit: "cover" }}
      />
    </Box>
    <Box
      className="overlay"
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        bgcolor: "rgba(0,0,0,0.3)",
        transition: "background-color 0.3s ease",
      }}
    />
    <Box
      sx={{
        position: "relative",
        zIndex: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: 3,
        color: "white",
      }}
    >
      <Box
        sx={{
          bgcolor: "#ffb700",
          color: "black",
          display: "inline-block",
          fontWeight: 700,
          width: 100,
          px: 1,
          py: 0.3,
          mb: 1,
          borderRadius: 0.5,
          fontSize: 14,
        }}
      >
        {promo.price}
      </Box>
      <Typography fontWeight={700} fontSize={22} color="#ffb700">
        {promo.title}
      </Typography>
      <Typography fontSize={18}>{promo.subtitle}</Typography>
      <Button
        variant="contained"
        sx={{
          mt: 2,
          width: "fit-content",
          bgcolor: "white",
          color: "black",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": { bgcolor: "#ffb700" },
        }}
      >
        Xem ngay
      </Button>
    </Box>
  </Box>
);

const PromotionBanner = () => {
  return (
    <Grid container spacing={2}>
      {promotions.map((promo, index) => (
        <Grid size={{ xs: 12, md: 6 }} key={index}>
          <PromotionCard promo={promo} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PromotionBanner;
