"use client";

import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // dùng router

export type Category = {
  title: string;
  image: string;
  slug: string; // Thêm slug để điều hướng
};

interface CategoryCarouselProps {
  categories: Category[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const router = useRouter();

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
    }
  };

  console.log("categories", categories);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => checkScroll();
    const timeout = setTimeout(() => checkScroll(), 100);

    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleClick = (slug: string) => {
    router.push(`/product?category=${slug}`);
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

      {showLeft && (
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
      )}

      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              onClick={() => handleClick(item.slug)} // Điều hướng khi click
              sx={{
                flex: "0 0 auto",
                textAlign: "center",
                width: 140,
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: 6,
                  cursor: "pointer",
                },
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
      </Box>

      {showRight && (
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
      )}
    </Box>
  );
};

export default CategoryCarousel;
