"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const products = [
  {
    title: "Demo sản phẩm thuộc tính",
    price: 2920000,
    originalPrice: 3500000,
    image: "/images/product/12.jpg",
    status: "Mới",
    sold: 12,
    inStock: false,
  },
  {
    title: "Máy cắt sắt 2300W Dewalt D28730-B1",
    price: 2920000,
    originalPrice: 3500000,
    image: "/images/product/12.jpg",
    status: "Mới",
    sold: 0,
    inStock: false,
  },
  {
    title: "Tời quay tay Kenbo cao cấp 1200LBS 20m",
    price: 859000,
    originalPrice: 1210000,
    image: "/images/product/12.jpg",
    status: "Mới, Bán chạy",
    sold: 0,
    inStock: false,
  },
  {
    title: "Tời điện Kenbo PA500-12m/30m 220v",
    price: 2180000,
    originalPrice: 2915000,
    image: "/images/product/12.jpg",
    status: "",
    sold: 11,
    inStock: true,
  },
  {
    title: "Máy bơm nước tự động tăng áp Shining SHP-128EA",
    price: 1090000,
    originalPrice: 1370000,
    image: "/images/product/12.jpg",
    status: "Bán chạy",
    sold: 8,
    inStock: true,
  },
  {
    title: "Máy cưa đĩa 1800W Bosch GKS 190",
    price: 2290000,
    originalPrice: 2650000,
    image: "/images/product/12.jpg",
    status: "Hot",
    sold: 15,
    inStock: true,
  },
  {
    title: "Máy mài góc 850W Makita GA4030",
    price: 890000,
    originalPrice: 1120000,
    image: "/images/product/12.jpg",
    status: "",
    sold: 30,
    inStock: true,
  },
  {
    title: "Máy khoan bê tông Bosch GBH 2-26 DRE",
    price: 3120000,
    originalPrice: 3650000,
    image: "/images/product/12.jpg",
    status: "Sale",
    sold: 22,
    inStock: true,
  },
];

const ProductCard = ({ product }: { product: (typeof products)[0] }) => (
  <Paper
    elevation={3}
    sx={{
      width: 240,
      height: 360,
      mx: 1,
      borderRadius: 2,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "transform 0.3s ease",
      flexShrink: 0,
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    <Box
      position="relative"
      height={150}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#fafafa" }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{ height: "100%", width: "auto", objectFit: "contain" }}
      />
      {product.status && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            bgcolor: "#f25c05",
            px: 1,
            borderRadius: 1,
            color: "white",
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {product.status}
        </Box>
      )}
    </Box>
    <Box
      px={2}
      py={1}
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Typography
        fontWeight={600}
        fontSize={14}
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {product.title}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" mt={1}>
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
      <Box mt={1}>
        <Button
          fullWidth
          variant={product.inStock ? "contained" : "outlined"}
          disabled={!product.inStock}
          sx={{
            bgcolor: product.inStock ? "#ffb700" : "#f0f0f0",
            color: product.inStock ? "black" : "gray",
            fontWeight: 600,
            textTransform: "none",
            fontSize: 14,
          }}
        >
          {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
        </Button>
        <Typography fontSize={12} mt={1}>
          Đã bán {product.sold}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const FlashSaleSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ position: "relative", px: 2 }}>
      {showLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            top: "45%",
            left: 0,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#ffb700" },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          px: 5,
          scrollSnapType: "x mandatory",
        }}
      >
        {products.map((product, idx) => (
          <Box key={idx} sx={{ scrollSnapAlign: "start", flex: "0 0 auto" }}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>

      {showRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            top: "45%",
            right: 0,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#ffb700" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default FlashSaleSlider;
