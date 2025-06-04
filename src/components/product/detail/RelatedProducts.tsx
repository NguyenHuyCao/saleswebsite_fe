"use client";

import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  price: number;
  imageAvt: string | null;
  slug: string;
  stockQuantity: number;
  origin: string;
  warrantyMonths: number;
  wishListUser?: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

interface RelatedProductsProps {
  category: Category | null;
}

export const RelatedProducts = ({ category }: RelatedProductsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const related = category?.products || [];

  const toggleLike = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", String(id));
      await fetch("http://localhost:8080/api/v1/wish_list", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Cập nhật lại trạng thái yêu thích bằng reload nhẹ
      window.location.reload();
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

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
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 8px 20px rgba(0,0,0,0.08)",
              }}
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
                <IconButton
                  onClick={() => toggleLike(item.id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "white",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: item.wishListUser ? "#ffe5e5" : "grey.100",
                    },
                  }}
                >
                  {item.wishListUser ? (
                    <FavoriteIcon fontSize="small" color="error" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>

                <CardMedia
                  component="img"
                  image={
                    item.imageAvt
                      ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
                      : "/images/product/placeholder.jpg"
                  }
                  alt={item.name}
                  sx={{ height: 120, objectFit: "cover" }}
                />
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="error.main"
                    fontWeight={700}
                  >
                    {item.price.toLocaleString()}₫
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 1, pb: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    disabled={item.stockQuantity === 0}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      fontSize: 12,
                      py: 0.5,
                    }}
                  >
                    {item.stockQuantity === 0 ? "Hết hàng" : "Thêm vào giỏ"}
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
