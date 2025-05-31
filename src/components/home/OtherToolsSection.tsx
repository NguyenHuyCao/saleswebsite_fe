"use client";

import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/navigation";
import ProductCard, { Product } from "../product/ProductCard";

const otherTools: Product[] = [
  {
    title: "Máy cắt cỏ 2 thì Kasei KS 33N",
    price: 2450000,
    originalPrice: 2950000,
    image: "/images/product/12.jpg",
    status: [],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 4.0,
  },
  {
    title: "Cuộn vòi tưới cây 20m Claber Kiros Kit (8945)",
    price: 1580000,
    originalPrice: 1600000,
    image: "/images/product/12.jpg",
    status: ["Mới", "Bán chạy"],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 4.2,
  },
  {
    title: "Bình phun hóa chất béc xoay Dudaco B801 8 lít",
    price: 283000,
    originalPrice: 420000,
    image: "/images/product/12.jpg",
    status: ["Mới"],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 3.8,
  },
  {
    title: "Máy cắt cỏ Hyundai HD 835",
    price: 2580000,
    originalPrice: 2800000,
    image: "/images/product/12.jpg",
    status: ["Bán chạy"],
    sale: true,
    inStock: true,
    label: "Thêm vào giỏ",
    rating: 4.4,
  },
];

const OtherToolsSection = () => {
  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
    }
  };

  React.useEffect(() => {
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
        DỤNG CỤ <span style={{ color: "#ffb700" }}>KHÁC</span>
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

      <Box mb={3} display="flex" flexWrap="wrap" gap={1} px={5}>
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

      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          scrollSnapType: "x mandatory",
          gap: 2,
          px: 5,
        }}
      >
        {otherTools.map((product, index) => (
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

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          onClick={() => router.push("/product")}
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
