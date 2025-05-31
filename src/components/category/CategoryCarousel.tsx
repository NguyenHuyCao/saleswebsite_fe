"use client";

import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import { useRef } from "react";

const categories = [
  { title: "Sản phẩm Hot", image: "/images/product/12.jpg" },
  { title: "Thiết bị giải trí", image: "/images/product/12.jpg" },
  { title: "Thiết bị điện lạnh", image: "/images/product/12.jpg" },
  { title: "Gia dụng nhà bếp", image: "/images/product/12.jpg" },
  { title: "Thiết bị di động", image: "/images/product/12.jpg" },
  { title: "Gia dụng sắc màu", image: "/images/product/12.jpg" },
  { title: "Gia dụng sức khỏe", image: "/images/product/12.jpg" },
];

const CategoryCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ position: "relative", px: 2, py: 4, bgcolor: "#fff" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={3}
        sx={{ color: "#000" }}
      >
        Danh mục sản phẩm
      </Typography>

      <IconButton
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "#ffb700",
          color: "#000",
          borderRadius: "50%",
          boxShadow: 2,
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 4,
          px: 6,
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {categories.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              flex: "0 0 auto",
              textAlign: "center",
              width: 140,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                mx: "auto",
                p: 1.5,
                border: "3px solid #ffb700",
                boxShadow: 3,
                bgcolor: "#fff",
                position: "relative",
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </Box>
            <Typography mt={1.5} fontSize={14} fontWeight={600} color="#000">
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>

      <IconButton
        onClick={() => scroll("right")}
        sx={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "#f25c05",
          color: "#fff",
          borderRadius: "50%",
          boxShadow: 2,
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default CategoryCarousel;
