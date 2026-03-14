"use client";

import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Chip,
  Container,
  Stack,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GridViewIcon from "@mui/icons-material/GridView";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function ProductCategorySection({
  categories,
}: {
  categories: {
    id: number;
    name: string;
    slug?: string;
    image?: string;
    products?: { id: number }[];
    count: number;
  }[];
}) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

      // Tính toán active index
      const itemWidth = 200 + 16; // width + gap
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(newIndex, categories.length - 1));
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    const resizeObserver = new ResizeObserver(() => checkScroll());
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      resizeObserver.disconnect();
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = isMobile ? 200 : 400;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Thống kê
  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat.products?.length || 0),
    0,
  );
  const activeCategories = categories.filter(
    (c) => (c.products?.length || 0) > 0,
  ).length;

  return (
    <Box sx={{ bgcolor: "#fff", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        {/* Header với thống kê */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="#333">
              Danh mục sản phẩm
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {activeCategories} danh mục đang có sản phẩm • {categories.length}{" "}
              tổng số
            </Typography>
          </Box>
          {/* Pagination indicator */}
          {categories.length > (isMobile ? 2 : 4) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Progress bar */}
              <Box
                sx={{
                  width: { xs: 150, sm: 200 },
                  height: 4,
                  bgcolor: "#f0f0f0",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${(activeIndex / (categories.length - 1)) * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #ffb700, #f25c05)",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>

              {/* Page info */}
              <Typography
                variant="caption"
                sx={{ color: "#999", minWidth: 60 }}
              >
                {Math.floor(activeIndex / (isMobile ? 2 : 4)) + 1}/
                {Math.ceil(categories.length / (isMobile ? 2 : 4))}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Categories carousel */}
        <Box sx={{ position: "relative" }}>
          {/* Navigation buttons */}
          {!isMobile && (
            <>
              <IconButton
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                sx={{
                  position: "absolute",
                  left: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "#fff",
                  boxShadow: 3,
                  zIndex: 2,
                  "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                  "&.Mui-disabled": { opacity: 0.3 },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                sx={{
                  position: "absolute",
                  right: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "#fff",
                  boxShadow: 3,
                  zIndex: 2,
                  "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                  "&.Mui-disabled": { opacity: 0.3 },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}

          {/* Scroll container */}
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              pb: 2,
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {categories.map((cat, idx) => {
              const productCount = cat.products?.length || 0;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  style={{ flex: "0 0 auto" }}
                >
                  <Box
                    onClick={() =>
                      cat.slug && router.push(`/product?category=${cat.slug}`)
                    }
                    sx={{
                      width: 200,
                      bgcolor: "#fff",
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      border: "1px solid #f0f0f0",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(242,92,5,0.15)",
                        borderColor: "#ffb700",
                      },
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        height: 140,
                        bgcolor: "#fafafa",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {cat.image ? (
                        <Box
                          component="img"
                          src={cat.image}
                          alt={cat.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#f5f5f5",
                          }}
                        >
                          <GridViewIcon sx={{ color: "#ccc", fontSize: 40 }} />
                        </Box>
                      )}

                      {/* Badge */}
                      <Chip
                        label={`${productCount} sản phẩm`}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: productCount > 0 ? "#f25c05" : "#999",
                          color: "#fff",
                          fontSize: "0.65rem",
                          height: 20,
                        }}
                      />
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2 }}>
                      <Tooltip title={cat.name} arrow>
                        <Typography
                          fontWeight={600}
                          fontSize={14}
                          noWrap
                          sx={{ mb: 0.5 }}
                        >
                          {cat.name}
                        </Typography>
                      </Tooltip>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {productCount > 0 ? "Còn hàng" : "Hết hàng"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#f25c05",
                            fontWeight: 600,
                            opacity: productCount > 0 ? 1 : 0.3,
                          }}
                        >
                          Xem ngay →
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </Box>

        {/* Mobile hint */}
        {isMobile && canScrollRight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
                color: "#999",
                animation: "slideHint 1.5s infinite",
                "@keyframes slideHint": {
                  "0%": { transform: "translateX(0)" },
                  "50%": { transform: "translateX(-10px)" },
                  "100%": { transform: "translateX(0)" },
                },
              }}
            >
              ← Vuốt để xem thêm danh mục →
            </Typography>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
