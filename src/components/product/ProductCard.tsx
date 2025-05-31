"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Tooltip,
  Rating,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Image from "next/image";

export type Product = {
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  status: string[];
  sale: boolean;
  inStock: boolean;
  label: string;
  rating?: number;
};

const ProductCard = ({ product }: { product: Product }) => (
  <Paper
    elevation={2}
    sx={{
      width: 240,
      height: 350,
      borderRadius: 2,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      p: 2,
      transition: "transform 0.3s ease",
      flexShrink: 0,
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    {/* SALE TAG */}
    {product.sale && (
      <Box
        sx={{
          bgcolor: "#f25c05",
          color: "white",
          px: 1,
          py: 0.2,
          fontSize: 12,
          fontWeight: "bold",
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 1,
        }}
      >
        Sale
      </Box>
    )}

    {/* IMAGE */}
    <Box
      position="relative"
      height={150}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#fafafa" }}
    >
      <Image
        src={product.image}
        alt={product.title}
        width={120}
        height={120}
        style={{ objectFit: "contain" }}
      />
    </Box>

    {/* STATUS BADGES */}
    <Stack direction="row" spacing={1} mt={1}>
      {product.status.map((s, idx) => (
        <Box
          key={idx}
          sx={{
            bgcolor: s === "Bán chạy" ? "#ffb700" : "#f25c05",
            color: "white",
            fontSize: 12,
            fontWeight: "bold",
            px: 1,
            borderRadius: 0.5,
          }}
        >
          {s}
        </Box>
      ))}
    </Stack>

    {/* PRODUCT TITLE */}
    <Typography
      fontSize={14}
      fontWeight={600}
      mt={1}
      sx={{
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        minHeight: 40,
      }}
    >
      {product.title}
    </Typography>

    {/* PRICE */}
    <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
      <Typography color="#f25c05" fontWeight="bold">
        {product.price.toLocaleString()}₫
      </Typography>
      <Typography
        fontSize={13}
        sx={{ textDecoration: "line-through", color: "gray" }}
      >
        {product.originalPrice.toLocaleString()}₫
      </Typography>
    </Stack>

    {/* RATING */}
    {product.rating !== undefined && (
      <Rating
        name="product-rating"
        value={product.rating}
        precision={0.5}
        size="small"
        readOnly
        sx={{ mt: 0.5 }}
      />
    )}

    {/* ACTION BUTTON */}
    <Box mt={"auto"}>
      <Button
        fullWidth
        variant={product.inStock ? "contained" : "outlined"}
        disabled={!product.inStock}
        sx={{
          mt: 1,
          bgcolor: product.inStock ? "#ffb700" : "#f0f0f0",
          color: product.inStock ? "black" : "gray",
          fontWeight: 600,
          textTransform: "none",
          fontSize: 14,
        }}
      >
        {product.label}
      </Button>
    </Box>

    {/* FAVORITE BUTTON */}
    <Tooltip title="Yêu thích">
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "white",
          borderRadius: "50%",
          boxShadow: 1,
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <FavoriteBorderIcon fontSize="small" sx={{ color: "#f25c05" }} />
      </Box>
    </Tooltip>
  </Paper>
);

export default ProductCard;
