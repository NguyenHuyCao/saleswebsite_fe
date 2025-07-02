"use client";

import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CategoryCarouselProps {
  categories: Category[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const scrollLeft = el.scrollLeft;
      const scrollWidth = el.scrollWidth;
      const clientWidth = el.clientWidth;

      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => checkScroll();
    const resizeObserver = new ResizeObserver(() => checkScroll());

    el.addEventListener("scroll", handleScroll);
    resizeObserver.observe(el);

    checkScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
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
            "&:hover": { bgcolor: "#f59e0b" },
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Box
                onClick={() => handleClick(item.slug)}
                sx={{
                  flex: "0 0 auto",
                  textAlign: "center",
                  width: isMobile ? 100 : 140,
                  transition: "transform 0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.05)",
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 80 : 120,
                    height: isMobile ? 80 : 120,
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
                    alt={item.name ?? "Category Image"}
                    fill
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
                <Typography
                  mt={1.5}
                  fontSize={isMobile ? 13 : 14}
                  fontWeight={600}
                  color="#000"
                >
                  {item.name}
                </Typography>
              </Box>
            </motion.div>
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
            "&:hover": { bgcolor: "#e64a19" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default CategoryCarousel;
