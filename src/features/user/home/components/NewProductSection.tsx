"use client";

import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Slider from "react-slick";
import ProductCard from "@/features/user/products/components/ProductCard";
import type { Product } from "../types";

type Props = { products: Product[] };

export default function NewProductSection({ products }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2 : isTablet ? 3 : 5,
    slidesToScroll: 1,
    arrows: !isTablet,
  };

  if (!products?.length) {
    return (
      <Box sx={{ px: 2, py: 5, textAlign: "center", color: "text.secondary" }}>
        Chưa có sản phẩm mới.
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        SẢN PHẨM <span style={{ color: "#ffb700" }}>Mới</span>
      </Typography>

      <Slider {...settings}>
        {products.map((product) => (
          <Box key={product.id} px={1}>
            <ProductCard
              product={product}
              mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?sort=createdAt,desc`}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
