"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
  Fade,
  Container,
} from "@mui/material";
import Slider from "react-slick";
import ProductCard from "@/features/user/products/components/ProductCard";
import type { Product } from "@/features/user/products/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

// Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

type Props = { products: Product[] };

export default function NewProductSection({ products }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const sliderRef = useRef<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(products.length);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  // Tính toán số sản phẩm hiển thị
  const slidesToShow = isMobile ? 2 : isTablet ? 3 : 5;
  const totalPages = Math.ceil(products.length / slidesToShow);
  const currentPage = Math.floor(currentSlide / slidesToShow) + 1;

  // Kiểm tra có thể scroll không
  useEffect(() => {
    if (sliderRef.current) {
      const slickList = document.querySelector(".slick-list");
      if (slickList) {
        const { scrollLeft, scrollWidth, clientWidth } =
          slickList as HTMLElement;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      }
    }
  }, [currentSlide]);

  // Cập nhật totalSlides khi products thay đổi
  useEffect(() => {
    setTotalSlides(products.length);
  }, [products]);

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPage = (pageIndex: number) => {
    sliderRef.current?.slickGoTo(pageIndex * slidesToShow);
  };

  // Settings cho slider
  const settings = {
    infinite: false,
    speed: 600,
    slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: false,
    beforeChange: (_current: number, next: number) => {
      setCurrentSlide(next);
    },
    afterChange: (current: number) => {
      setCurrentSlide(current);
    },
    responsive: [
      {
        breakpoint: 900,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
    ],
  };

  // Xử lý khi không có sản phẩm
  if (!products?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            px: 2,
            py: 8,
            textAlign: "center",
            bgcolor: "#fafafa",
            borderRadius: 4,
          }}
        >
          <FiberNewIcon sx={{ fontSize: 48, color: "#ffb700", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có sản phẩm mới
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hãy quay lại sau để khám phá những sản phẩm mới nhất!
          </Typography>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
        <Container maxWidth="xl">
          {/* Header với animation */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box
                    sx={{
                      bgcolor: "#f25c05",
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 12px rgba(242,92,5,0.2)",
                    }}
                  >
                    <FiberNewIcon sx={{ color: "#fff", fontSize: 28 }} />
                  </Box>
                </motion.div>
                <Box>
                  <Typography variant="h5" fontWeight={800} color="#333">
                    Sản phẩm mới
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {products.length} sản phẩm vừa được cập nhật
                  </Typography>
                </Box>
              </Box>

              {/* Pagination và navigation cho desktop */}
              {!isMobile && totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {/* Pagination dots */}
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Box
                            onClick={() => goToPage(i)}
                            sx={{
                              width: i === currentPage - 1 ? 24 : 6,
                              height: 6,
                              borderRadius: 3,
                              bgcolor:
                                i === currentPage - 1 ? "#f25c05" : "#ffb700",
                              opacity: i === currentPage - 1 ? 1 : 0.3,
                              cursor: "pointer",
                              transition: "all 0.3s",
                              "&:hover": {
                                opacity: 1,
                                width: i === currentPage - 1 ? 24 : 12,
                              },
                            }}
                          />
                        </motion.div>
                      ))}
                    </Box>

                    {/* Navigation buttons */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconButton
                          onClick={handlePrev}
                          disabled={currentSlide === 0}
                          sx={{
                            bgcolor: currentSlide === 0 ? "#f5f5f5" : "#ffb700",
                            color: currentSlide === 0 ? "#bdbdbd" : "#000",
                            width: 36,
                            height: 36,
                            "&:hover": {
                              bgcolor:
                                currentSlide === 0 ? "#f5f5f5" : "#f59e0b",
                            },
                          }}
                        >
                          <ChevronLeftIcon />
                        </IconButton>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconButton
                          onClick={handleNext}
                          disabled={
                            currentSlide + slidesToShow >= products.length
                          }
                          sx={{
                            bgcolor:
                              currentSlide + slidesToShow >= products.length
                                ? "#f5f5f5"
                                : "#f25c05",
                            color:
                              currentSlide + slidesToShow >= products.length
                                ? "#bdbdbd"
                                : "#fff",
                            width: 36,
                            height: 36,
                            "&:hover": {
                              bgcolor:
                                currentSlide + slidesToShow >= products.length
                                  ? "#f5f5f5"
                                  : "#e64a19",
                            },
                          }}
                        >
                          <ChevronRightIcon />
                        </IconButton>
                      </motion.div>
                    </Box>

                    {/* Page indicator */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        label={`${currentPage}/${totalPages}`}
                        size="small"
                        sx={{
                          bgcolor: "#fff8e1",
                          color: "#f25c05",
                          fontWeight: 600,
                          border: "1px solid #ffb700",
                        }}
                      />
                    </motion.div>
                  </Box>
                </motion.div>
              )}
            </Box>
          </motion.div>

          {/* Slider Container với animation */}
          <motion.div variants={itemVariants}>
            <Box sx={{ position: "relative" }}>
              {/* Slider */}
              <Slider ref={sliderRef} {...settings}>
                {products.map((product, index) => (
                  <Box key={product.id} px={1}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ProductCard
                        product={product}
                        mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?sort=createdAt,desc`}
                      />
                    </motion.div>
                  </Box>
                ))}
              </Slider>

              {/* Mobile hint */}
              {isMobile && products.length > slidesToShow && (
                <Fade in timeout={1000}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      mt: 3,
                      color: "#999",
                      fontStyle: "italic",
                      animation: "slideHint 1.5s infinite",
                      "@keyframes slideHint": {
                        "0%": { transform: "translateX(0)" },
                        "50%": { transform: "translateX(-10px)" },
                        "100%": { transform: "translateX(0)" },
                      },
                    }}
                  >
                    ← Vuốt để xem thêm sản phẩm →
                  </Typography>
                </Fade>
              )}
            </Box>
          </motion.div>

          {/* Mobile Pagination với animation */}
          {isMobile && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 3,
                  gap: 2,
                }}
              >
                {/* Progress bar */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 240,
                    height: 4,
                    bgcolor: "rgba(255, 183, 0, 0.2)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentSlide + slidesToShow) / products.length) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #ffb700, #f25c05)",
                      borderRadius: 2,
                    }}
                  />
                </Box>

                {/* Page number */}
                <Typography
                  variant="caption"
                  sx={{ color: "#999", minWidth: 45 }}
                >
                  {currentPage}/{totalPages}
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Xem thêm button với animation */}
          {!isMobile && products.length > slidesToShow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Box
                  component="button"
                  onClick={() =>
                    (window.location.href = "/product?sort=newest")
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "transparent",
                    border: "none",
                    color: "#f25c05",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      "& .arrow": {
                        transform: "translateX(5px)",
                      },
                    },
                  }}
                >
                  <Typography variant="body2">
                    Xem tất cả sản phẩm mới
                  </Typography>
                  <ArrowForwardIcon
                    className="arrow"
                    sx={{ fontSize: 18, transition: "transform 0.3s" }}
                  />
                </Box>
              </Box>
            </motion.div>
          )}
        </Container>
      </Box>
    </motion.div>
  );
}
