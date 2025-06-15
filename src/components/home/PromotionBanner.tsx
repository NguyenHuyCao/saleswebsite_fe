"use client";

import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const promotions = [
  {
    title: "Khuyến mãi",
    subtitle: "Máy khoan",
    price: "5.590.000đ",
    image: "/images/banner/istockphoto-874289546-612x612.jpg",
    link: "/promotion",
  },
  {
    title: "Khuyến mãi",
    subtitle: "Máy cưa",
    price: "2.920.000đ",
    image: "/images/banner/May-cua-xich-chay-pin-STIHL-MSA-120.jpg",
    link: "/promotion",
  },
];

const PromotionCard = ({ promo }: { promo: (typeof promotions)[0] }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        onClick={() => router.push(promo.link)}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          height: { xs: 200, sm: 250, md: 300 },
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
        {/* Background Image */}
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
            priority
          />
        </Box>

        {/* Overlay */}
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

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 2.5, sm: 4 },
            color: "white",
          }}
        >
          <Box
            sx={{
              bgcolor: "#ffb700",
              color: "black",
              display: "inline-block",
              fontWeight: 700,
              px: 1.5,
              py: 0.3,
              mb: 1,
              borderRadius: 1,
              fontSize: 14,
              width: "fit-content",
            }}
          >
            {promo.price}
          </Box>
          <Typography fontWeight={700} fontSize={24} color="#ffb700">
            {promo.title}
          </Typography>
          <Typography fontSize={18} lineHeight={1.3}>
            {promo.subtitle}
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              width: "fit-content",
              bgcolor: "white",
              color: "black",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 10,
              px: 2.5,
              py: 0.6,
              fontSize: 14,
              "&:hover": {
                bgcolor: "#ffb700",
              },
            }}
          >
            Xem ngay
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

const PromotionBanner = () => {
  return (
    <Grid container spacing={3}>
      {promotions.map((promo, index) => (
        <Grid size={{ xs: 12, md: 6 }} key={index}>
          <PromotionCard promo={promo} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PromotionBanner;
