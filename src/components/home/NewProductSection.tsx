"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard, { Product } from "../product/ProductCard";

const newProducts: Product[] = [
  {
    title: "Demo sản phẩm thuộc tính",
    price: 2920000,
    originalPrice: 3500000,
    image: "/images/product/12.jpg",
    status: ["Mới"],
    sale: true,
    inStock: true,
    label: "Xem chi tiết",
    rating: 4.5,
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
    rating: 4.0,
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
    rating: 4.2,
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
    rating: 4.8,
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
    rating: 3.5,
  },
];

const NewProductSection = () => {
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
    <Box sx={{ position: "relative", px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        SẢN PHẨM <span style={{ color: "#ffb700" }}>MỚI</span>
      </Typography>

      {showLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
            transform: "translateY(-50%)",
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
          scrollSnapType: "x mandatory",
          px: 5,
        }}
      >
        {newProducts.map((product, index) => (
          <Box
            key={index}
            sx={{ width: 250, scrollSnapAlign: "start", flexShrink: 0 }}
          >
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>

      {showRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
            transform: "translateY(-50%)",
            "&:hover": { bgcolor: "#ffb700" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default NewProductSection;
