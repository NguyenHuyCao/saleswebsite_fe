"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard, { Product } from "../product/ProductCard";

const products: Product[] = [
  {
    title: "Demo sản phẩm thuộc tính",
    price: 2920000,
    originalPrice: 3500000,
    image: "/images/product/12.jpg",
    status: ["Mới"],
    sale: true,
    inStock: false,
    label: "Hết hàng",
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
  {
    title: "Tời điện Kenbo PA500-12m/30m 220v",
    price: 2180000,
    originalPrice: 2915000,
    image: "/images/product/12.jpg",
    status: [],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 4.2,
  },
  {
    title: "Máy bơm nước tự động tăng áp Shining SHP-128EA",
    price: 1090000,
    originalPrice: 1370000,
    image: "/images/product/12.jpg",
    status: ["Bán chạy"],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 3.8,
  },
  {
    title: "Máy cưa đĩa 1800W Bosch GKS 190",
    price: 2290000,
    originalPrice: 2650000,
    image: "/images/product/12.jpg",
    status: ["Hot"],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 4.7,
  },
  {
    title: "Máy mài góc 850W Makita GA4030",
    price: 890000,
    originalPrice: 1120000,
    image: "/images/product/12.jpg",
    status: [],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 4.0,
  },
  {
    title: "Máy khoan bê tông Bosch GBH 2-26 DRE",
    price: 3120000,
    originalPrice: 3650000,
    image: "/images/product/12.jpg",
    status: ["Sale"],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 4.6,
  },
];

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
          gap: 1,
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
