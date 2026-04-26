"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
  Skeleton,
  Fade,
} from "@mui/material";
import Slider from "react-slick";
import ProductCard from "@/features/user/products/components/ProductCard";
import type { Product } from "@/features/user/products/types";
import { motion } from "framer-motion";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";

type Props = { products: Product[]; isLoading?: boolean };

export default function BestSellersSection({ products, isLoading }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const sliderRef = useRef<Slider | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesToShow = isMobile ? 2 : isTablet ? 3 : 5;
  const totalPages = Math.ceil(products.length / slidesToShow);
  const currentPage = Math.floor(currentSlide / slidesToShow) + 1;

  const goToPage = (idx: number) => sliderRef.current?.slickGoTo(idx * slidesToShow);

  // Fix: react-slick marks cloned/inactive slides aria-hidden="true" but doesn't set
  // tabIndex=-1 on child interactive elements, causing accessibility violations.
  const fixSlickA11y = useCallback(() => {
    const container = sliderContainerRef.current;
    if (!container) return;
    container.querySelectorAll<HTMLElement>('.slick-slide[aria-hidden="true"]').forEach((slide) => {
      slide.setAttribute("inert", "");
    });
    container.querySelectorAll<HTMLElement>('.slick-slide:not([aria-hidden="true"])').forEach((slide) => {
      slide.removeAttribute("inert");
    });
  }, []);

  useEffect(() => {
    fixSlickA11y();
    const container = sliderContainerRef.current;
    if (!container) return;
    const observer = new MutationObserver(fixSlickA11y);
    observer.observe(container, { subtree: true, attributeFilter: ["aria-hidden"] });
    return () => observer.disconnect();
  }, [fixSlickA11y]);

  const settings = {
    infinite: false,
    speed: 600,
    slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    afterChange: (cur: number) => setCurrentSlide(cur),
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  if (isLoading) {
    return (
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Skeleton variant="rounded" height={48} width={240} sx={{ mb: 3, borderRadius: 3 }} />
        <Box sx={{ display: "flex", gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" height={320} sx={{ flex: 1, borderRadius: 3 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (!products?.length) return null;

  return (
    <motion.div

      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "#fff" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: { xs: 2, md: 4 },
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                bgcolor: "#ffb700",
                width: 48,
                height: 48,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 12px rgba(255,183,0,0.3)",
              }}
            >
              <TrendingUpIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography component="h2" variant="h5" fontWeight={800} color="#333">
                  Sản phẩm phổ biến
                </Typography>
                <Chip
                  label="HOT"
                  size="small"
                  sx={{
                    bgcolor: "#f25c05",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Được khách hàng tin dùng nhiều nhất
              </Typography>
            </Box>
          </Box>

          {!isMobile && totalPages > 1 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => goToPage(i)}
                    sx={{
                      width: i === currentPage - 1 ? 24 : 6,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: i === currentPage - 1 ? "#ffb700" : "#f25c05",
                      opacity: i === currentPage - 1 ? 1 : 0.25,
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => sliderRef.current?.slickPrev()}
                  disabled={currentSlide === 0}
                  aria-label="Trang trước"
                  sx={{
                    bgcolor: currentSlide === 0 ? "#f5f5f5" : "#ffb700",
                    color: currentSlide === 0 ? "#bdbdbd" : "#000",
                    width: 36,
                    height: 36,
                    "&:hover": { bgcolor: currentSlide === 0 ? "#f5f5f5" : "#f59e0b" },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={() => sliderRef.current?.slickNext()}
                  disabled={currentSlide + slidesToShow >= products.length}
                  aria-label="Trang tiếp"
                  sx={{
                    bgcolor: currentSlide + slidesToShow >= products.length ? "#f5f5f5" : "#f25c05",
                    color: currentSlide + slidesToShow >= products.length ? "#bdbdbd" : "#fff",
                    width: 36,
                    height: 36,
                    "&:hover": { bgcolor: currentSlide + slidesToShow >= products.length ? "#f5f5f5" : "#e64a19" },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
              <Chip
                label={`${currentPage}/${totalPages}`}
                size="small"
                sx={{ bgcolor: "#fff8e1", color: "#f25c05", fontWeight: 600, border: "1px solid #ffb700" }}
              />
            </Box>
          )}
        </Box>

        {/* Slider */}
        <Box ref={sliderContainerRef} sx={{ position: "relative", pt: 1, "& .slick-list": { overflow: "visible !important" }, overflow: "hidden" }}>
          <Slider ref={sliderRef} {...settings}>
            {products.map((product, idx) => (
              <Box key={product.id} px={1}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.2), duration: 0.3, ease: "easeOut" }}
                >
                  <ProductCard
                    product={product}
                    mutateKey="/api/v1/products?sort=rating,desc"
                  />
                </motion.div>
              </Box>
            ))}
          </Slider>

          {isMobile && products.length > slidesToShow && (
            <Fade in timeout={1000}>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "center", mt: 3, color: "#bbb", fontStyle: "italic" }}
              >
                Vuốt để xem thêm →
              </Typography>
            </Fade>
          )}
        </Box>

        {/* Mobile pagination */}
        {isMobile && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3, gap: 2 }}>
            <Box sx={{ width: "100%", maxWidth: 240, height: 4, bgcolor: "rgba(255,183,0,0.2)", borderRadius: 2, overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${((currentSlide + slidesToShow) / products.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                style={{ height: "100%", background: "linear-gradient(90deg, #ffb700, #f25c05)", borderRadius: 2 }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "#999", minWidth: 45 }}>
              {currentPage}/{totalPages}
            </Typography>
          </Box>
        )}

        {/* View all */}
        {!isMobile && products.length > slidesToShow && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Box
              component="button"
              onClick={() => router.push("/product?sort=rating,desc")}
              sx={{
                display: "flex", alignItems: "center", gap: 1,
                bgcolor: "transparent", border: "none",
                color: "#f25c05", fontWeight: 600, cursor: "pointer",
                "&:hover .arrow": { transform: "translateX(5px)" },
              }}
            >
              <Typography variant="body2">Xem tất cả sản phẩm phổ biến</Typography>
              <ArrowForwardIcon className="arrow" sx={{ fontSize: 18, transition: "transform 0.3s" }} />
            </Box>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
