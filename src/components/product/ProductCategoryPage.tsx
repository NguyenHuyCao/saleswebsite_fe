"use client";

// ProductCategoryPage.tsx
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef, useState, useEffect } from "react";

const categories = [
  {
    name: "Máy khoan",
    count: 10,
    image: "/images/product/2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
  },
  {
    name: "Máy nông nghiệp",
    count: 9,
    image: "/images/product/2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
  },
  {
    name: "Máy hàn điện tử",
    count: 5,
    image: "/images/product/2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
  },
  {
    name: "Máy rửa xe",
    count: 10,
    image: "/images/product/2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
  },
  {
    name: "Máy bơm nước",
    count: 0,
    image: "/images/product/2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
  },
  {
    name: "Thang nhôm",
    count: 2,
    image: "/images/product/2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
  },
  {
    name: "Máy phát điện",
    count: 4,
    image: "/images/product/2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
  },
  {
    name: "Máy cắt cỏ",
    count: 7,
    image: "/images/product/2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
  },
];

export default function ProductCategoryPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateScrollVisibility = () => {
    const container = scrollRef.current;
    if (container) {
      setShowLeft(container.scrollLeft > 0);
      setShowRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    updateScrollVisibility();
    container.addEventListener("scroll", updateScrollVisibility);
    window.addEventListener("resize", updateScrollVisibility);
    return () => {
      container.removeEventListener("scroll", updateScrollVisibility);
      window.removeEventListener("resize", updateScrollVisibility);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -240 : 240;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        py: 6,
        bgcolor: "#fff",
        position: "relative",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        DANH MỤC{" "}
        <Box component="span" sx={{ color: "#ffb700" }}>
          SẢN PHẨM
        </Box>
      </Typography>

      <Box sx={{ position: "relative" }}>
        {showLeft && (
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#f5f5f5" },
              display: { xs: "none", md: "flex" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            gap: 2,
            px: { xs: 1, sm: 4 },
          }}
        >
          {categories.map((cat, index) => (
            <Box
              key={index}
              sx={{
                flex: "0 0 auto",
                width: { xs: 220, md: 240 },
                height: 100,
                bgcolor: "#f9f9f9",
                borderRadius: 2,
                p: 2,
                boxShadow: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  backgroundColor: "#fffef7",
                },
              }}
            >
              <Box
                component="img"
                src={cat.image}
                alt={cat.name}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 1,
                  mr: 2,
                  objectFit: "cover",
                }}
              />
              <Box>
                <Typography fontWeight="medium" fontSize={{ xs: 14, md: 16 }}>
                  {cat.name}
                </Typography>
                <Typography variant="body2" color="orange">
                  ({cat.count} sản phẩm)
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {showRight && (
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#f5f5f5" },
              display: { xs: "none", md: "flex" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
