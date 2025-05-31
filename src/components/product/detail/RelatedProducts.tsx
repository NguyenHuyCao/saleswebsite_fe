"use client";

import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const related = Array.from({ length: 10 }).map((_, index) => ({
  name: `Sản phẩm demo ${index + 1}`,
  image: "/images/product/mpd-daewoo-dag-9900dbx-1_20210514115542.jpg",
  price: 1000000 + index * 100000,
  oldPrice: 1200000 + index * 100000,
  tags: index % 2 === 0 ? ["Mới"] : ["Bán chạy"],
  rating: 4,
  soldOut: index % 4 === 0,
}));

export const RelatedProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, clientWidth, scrollWidth } = container;
      const isScrollable = scrollWidth > clientWidth;
      setCanScrollLeft(isScrollable && scrollLeft > 0);
      setCanScrollRight(
        isScrollable && scrollLeft + clientWidth < scrollWidth - 1
      );
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Box position="relative">
      <Typography variant="h6" fontWeight={700} mb={2}>
        SẢN PHẨM{" "}
        <Box component="span" color="warning.main">
          LIÊN QUAN
        </Box>
      </Typography>

      <Box sx={{ position: "relative" }}>
        {canScrollLeft && (
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              bgcolor: "white",
              boxShadow: 2,
              border: "1px solid #ddd",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {canScrollRight && (
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translate(50%, -50%)",
              zIndex: 10,
              bgcolor: "white",
              boxShadow: 2,
              border: "1px solid #ddd",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            pb: 1,
            px: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {related.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ scale: 1.03 }}
              style={{ minWidth: 200, maxWidth: 200 }}
            >
              <Card
                sx={{
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                {item.tags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    color={
                      tag === "Mới"
                        ? "warning"
                        : tag === "Bán chạy"
                        ? "success"
                        : "error"
                    }
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 2,
                      fontSize: 12,
                    }}
                  />
                ))}
                <Chip
                  icon={<FavoriteBorderIcon fontSize="small" />}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "white",
                  }}
                />
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  sx={{ height: 120, objectFit: "cover" }}
                />
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {item.name}
                  </Typography>
                  <Rating value={item.rating} readOnly size="small" />
                  <Typography
                    variant="body2"
                    color="error.main"
                    fontWeight={700}
                  >
                    {item.price.toLocaleString()}₫
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        ml: 0.5,
                      }}
                    >
                      {item.oldPrice.toLocaleString()}₫
                    </Typography>
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 1, pb: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    disabled={item.soldOut}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      fontSize: 12,
                      py: 0.5,
                    }}
                  >
                    {item.soldOut ? "Hết hàng" : "Thêm vào giỏ"}
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
