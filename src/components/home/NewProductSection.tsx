"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const newProducts = [
  {
    title: "Demo sản phẩm thuộc tính",
    price: 2920000,
    originalPrice: 3500000,
    image: "/images/product/12.jpg",
    status: ["Mới"],
    sale: true,
    inStock: true,
    label: "Xem chi tiết",
  },
  {
    title: "Máy cắt sắt 2300W Dewalt D28730-B1",
    price: 2920000,
    originalPrice: 3500000,
    image: "/images/product/12.jpg",
    status: ["Mới"],
    sale: true,
    inStock: false,
    label: "Hết hàng",
  },
  {
    title: "Máy cắt sắt Bosch GCO 220",
    price: 2880000,
    originalPrice: 3500000,
    image: "/images/product/12.jpg",
    status: ["Mới"],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
  },
  {
    title: "Máy cưa xích điện Kenmax KMEC004",
    price: 1500000,
    originalPrice: 1800000,
    image: "/images/product/12.jpg",
    status: ["Mới", "Bán chạy"],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
  },
  {
    title: "Tời quay tay Kenbo cao cấp 1200LBS 20m",
    price: 859000,
    originalPrice: 1210000,
    image: "/images/product/12.jpg",
    status: ["Mới", "Bán chạy"],
    sale: true,
    inStock: false,
    label: "Hết hàng",
  },
];

const ProductCard = ({ product }: { product: (typeof newProducts)[0] }) => (
  <Paper
    elevation={2}
    sx={{ borderRadius: 1, overflow: "hidden", position: "relative", p: 2 }}
  >
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
        }}
      >
        Sale
      </Box>
    )}
    <Box
      sx={{
        height: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{ maxHeight: "100%", objectFit: "contain" }}
      />
    </Box>
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
    <Typography fontSize={14} fontWeight={600} mt={1} height={40}>
      {product.title}
    </Typography>
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

const NewProductSection = () => {
  return (
    <Box px={3} py={4}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        SẢN PHẨM <span style={{ color: "#ffb700" }}>MỚI</span>
      </Typography>
      <Grid container spacing={2}>
        {newProducts.map((product, index) => (
          <Grid size={{ sm: 6, md: 4, lg: 3, xl: 2.4, xs: 12 }} key={index}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewProductSection;
