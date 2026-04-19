"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
  Fade,
  
  Skeleton,
  Paper,
  Stack,
} from "@mui/material";
import Slider from "react-slick";
import ProductCard from "@/features/user/products/components/ProductCard";
import type { Product, Category } from "@/features/user/products/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { mapProduct } from "@/lib/utils/productMapper";
import { motion } from "framer-motion";

// Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";

interface Props {
  category: Category | null;
}

export default function RelatedProductsSlick({ category }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const dispatch = useDispatch<AppDispatch>();
  const sliderRef = useRef<Slider | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const wishlistItems = useSelector((state: AppState) => state.wishlist.result);
  const favoriteIdSet = useMemo(
    () => new Set(wishlistItems.map((i) => i.id)),
    [wishlistItems],
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (category?.products?.length) {
          const nowMs = Date.now();
          const mapped = category.products.map((item: any) => {
            const p = mapProduct(item, nowMs);
            // Ghi đè favorite từ wishlist redux
            return { ...p, favorite: favoriteIdSet.has(item.id) };
          });
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, favoriteIdSet]);

  // Tính toán số sản phẩm hiển thị
  const slidesToShow = isMobile ? 2 : isTablet ? 3 : 5;
  const totalProducts = products.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / slidesToShow));
  const currentPage = Math.floor(currentSlide / slidesToShow) + 1;

  // Kiểm tra có thể scroll không - FIX: Dùng ref thay vì querySelector
  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
      }
    };

    // Initial check
    const timer = setTimeout(checkScroll, 100);

    // Add scroll listener
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", checkScroll);
    }

    return () => {
      clearTimeout(timer);
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", checkScroll);
      }
    };
  }, [currentSlide, products.length]);

  const settings = {
    infinite: false,
    speed: 600,
    slidesToShow,
    slidesToScroll: isMobile ? 1 : slidesToShow,
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

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPage = (pageIndex: number) => {
    sliderRef.current?.slickGoTo(pageIndex * slidesToShow);
  };

  // Tính toán progress cho mobile
  const progressValue =
    totalProducts > 0
      ? ((currentSlide + slidesToShow) / totalProducts) * 100
      : 0;

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          gap={2}
        >
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={280}
              sx={{ borderRadius: 3 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  // Empty state
  if (!products.length) {
    return (
      <Box sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "#fafafa",
            borderRadius: 4,
            border: "2px dashed #ffb700",
          }}
        >
          <InventoryIcon sx={{ fontSize: 48, color: "#ffb700", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không có sản phẩm liên quan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng khám phá thêm sản phẩm khác của chúng tôi
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            <CategoryIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#333">
              Sản phẩm liên quan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {products.length} sản phẩm cùng danh mục
            </Typography>
          </Box>
        </Box>

        {/* Pagination và navigation cho desktop */}
        {!isMobile && totalPages > 1 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Pagination dots */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {Array.from({ length: totalPages }).map((_, i) => {
                const isActive = i === currentPage - 1;
                return (
                  <Box
                    key={i}
                    onClick={() => goToPage(i)}
                    sx={{
                      width: isActive ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: isActive ? "#f25c05" : "#ffb700",
                      opacity: isActive ? 1 : 0.4,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        opacity: 1,
                        width: isActive ? 24 : 12,
                      },
                    }}
                  />
                );
              })}
            </Box>

            {/* Navigation buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handlePrev}
                disabled={currentSlide === 0}
                sx={{
                  bgcolor: currentSlide === 0 ? "#f5f5f5" : "#ffb700",
                  color: currentSlide === 0 ? "#bdbdbd" : "#000",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: currentSlide === 0 ? "#f5f5f5" : "#f59e0b",
                  },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentSlide + slidesToShow >= totalProducts}
                sx={{
                  bgcolor:
                    currentSlide + slidesToShow >= totalProducts
                      ? "#f5f5f5"
                      : "#f25c05",
                  color:
                    currentSlide + slidesToShow >= totalProducts
                      ? "#bdbdbd"
                      : "#fff",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor:
                      currentSlide + slidesToShow >= totalProducts
                        ? "#f5f5f5"
                        : "#e64a19",
                  },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Page indicator */}
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
          </Box>
        )}
      </Box>

      {/* Slider Container */}
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          overflow: "hidden",
          ".slick-track": {
            display: "flex",
          },
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {products.map((product, index) => (
            <Box key={product.id} px={1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <ProductCard
                  product={product}
                  mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${category?.slug}`}
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
                mt: 2,
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

      {/* Mobile pagination */}
      {isMobile && totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mt: 3,
          }}
        >
          {/* Progress bar */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 280,
              height: 4,
              bgcolor: "rgba(255, 183, 0, 0.2)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${Math.min(progressValue, 100)}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ffb700, #f25c05)",
                borderRadius: 2,
                transition: "width 0.3s ease",
              }}
            />
          </Box>

          {/* Page info */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="caption" sx={{ color: "#999" }}>
              Trang {currentPage}/{totalPages}
            </Typography>
            <Chip
              label={`${currentSlide + 1}-${Math.min(currentSlide + slidesToShow, totalProducts)}/${totalProducts}`}
              size="small"
              sx={{
                bgcolor: "#fff8e1",
                color: "#f25c05",
                fontSize: "0.6rem",
                height: 20,
              }}
            />
          </Stack>
        </Box>
      )}
    </Box>
  );
}
