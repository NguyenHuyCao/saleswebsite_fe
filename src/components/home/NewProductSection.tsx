"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard, { Product } from "../product/ProductCard";

interface NewProductSectionProps {
  products: Product[];
}

const NewProductSection: React.FC<NewProductSectionProps> = ({ products }) => {
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
        {products.map((product, index) => (
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
