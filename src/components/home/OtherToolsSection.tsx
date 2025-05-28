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

const otherTools = [
  {
    title: "Máy cắt cỏ 2 thì Kasei KS 33N",
    price: 2450000,
    originalPrice: 2950000,
    image: "/images/product/12.jpg",
    status: [],
    sale: true,
    inStock: true,
  },
  {
    title: "Cuộn vòi tưới cây 20m Claber Kiros Kit (8945)",
    price: 1580000,
    originalPrice: 1600000,
    image: "/images/product/12.jpg",
    status: ["Mới", "Bán chạy"],
    sale: true,
    inStock: true,
  },
  {
    title: "Bình phun hóa chất béc xoay Dudaco B801 8 lít",
    price: 283000,
    originalPrice: 420000,
    image: "/images/product/12.jpg",
    status: ["Mới"],
    sale: true,
    inStock: true,
  },
  {
    title: "Máy cắt cỏ Hyundai HD 835",
    price: 2580000,
    originalPrice: 2800000,
    image: "/images/product/12.jpg",
    status: ["Bán chạy"],
    sale: true,
    inStock: true,
  },
];

const ProductCard = ({ product }: { product: (typeof otherTools)[0] }) => (
  <Paper
    elevation={3}
    sx={{
      borderRadius: 1,
      overflow: "hidden",
      position: "relative",
      p: 2,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 6,
      },
    }}
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
      variant="contained"
      sx={{
        mt: 1,
        bgcolor: "#ffb700",
        color: "black",
        fontWeight: 600,
        textTransform: "none",
        fontSize: 14,
        "&:hover": { bgcolor: "#f25c05" },
      }}
    >
      Thêm vào giỏ
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
          transition: "background-color 0.2s",
          "&:hover": { bgcolor: "#ffb700" },
        }}
      >
        <FavoriteBorderIcon fontSize="small" sx={{ color: "#f25c05" }} />
      </Box>
    </Tooltip>
  </Paper>
);

const OtherToolsSection = () => {
  return (
    <Box px={3} py={4}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        DỤNG CỤ <span style={{ color: "#ffb700" }}>KHÁC</span>
      </Typography>
      <Box mb={3} display="flex" flexWrap="wrap" gap={1}>
        {["Máy nông nghiệp", "Thang nhôm", "Máy rửa xe", "Thiết bị nâng"].map(
          (label, idx) => (
            <Button
              key={idx}
              variant={idx === 0 ? "contained" : "outlined"}
              sx={{
                bgcolor: idx === 0 ? "#ffb700" : "transparent",
                color: "black",
                borderColor: "#ffb700",
                textTransform: "none",
                fontWeight: 600,
                px: 2,
                "&:hover": {
                  bgcolor: "#f25c05",
                  borderColor: "#f25c05",
                },
              }}
            >
              {label}
            </Button>
          )
        )}
      </Box>
      <Grid container spacing={2}>
        {otherTools.map((product, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={index}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#ffb700",
            color: "black",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#ffb700",
              color: "black",
              borderColor: "#f25c05",
            },
          }}
        >
          Xem tất cả
        </Button>
      </Box>
    </Box>
  );
};

export default OtherToolsSection;
