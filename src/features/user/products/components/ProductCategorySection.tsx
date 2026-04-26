"use client";

import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Chip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GridViewIcon from "@mui/icons-material/GridView";
import Image from "next/image";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    const itemWidth = 176 + 12;
    setActiveIndex(Math.min(Math.round(scrollLeft / itemWidth), categories.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      ro.disconnect();
    };
  }, [categories]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  const activeCategories = categories.filter((c) => (c.products?.length || 0) > 0).length;

  return (
    <Box sx={{ bgcolor: "#fff", py: { xs: 1.5, md: 2 }, mb: { xs: 1, md: 2 } }}>
      {/* Compact header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="#333">
            Danh mục sản phẩm
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {activeCategories}/{categories.length} danh mục đang có hàng
          </Typography>
        </Box>

        {/* Progress bar */}
        {categories.length > (isMobile ? 2 : 4) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: { xs: 100, sm: 160 },
                height: 3,
                bgcolor: "#f0f0f0",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${(activeIndex / Math.max(1, categories.length - 1)) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #ffb700, #f25c05)",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
            <Typography variant="caption" color="#999" sx={{ minWidth: 40 }}>
              {Math.floor(activeIndex / (isMobile ? 2 : 4)) + 1}/
              {Math.ceil(categories.length / (isMobile ? 2 : 4))}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Carousel */}
      <Box sx={{ position: "relative" }}>
        {!isMobile && (
          <>
            <IconButton
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              size="small"
              sx={{
                position: "absolute",
                left: -18,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "#fff",
                boxShadow: 2,
                zIndex: 2,
                "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                "&.Mui-disabled": { opacity: 0.3 },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              size="small"
              sx={{
                position: "absolute",
                right: -18,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "#fff",
                boxShadow: 2,
                zIndex: 2,
                "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                "&.Mui-disabled": { opacity: 0.3 },
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 1.5,
            pb: 1,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {categories.map((cat) => {
            const productCount = cat.products?.length || 0;
            return (
              <Box
                key={cat.id}
                onClick={() => cat.slug && router.push(`/product?category=${cat.slug}`)}
                sx={{
                  flex: "0 0 auto",
                  width: { xs: 140, sm: 176 },
                  bgcolor: "#fff",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  border: "1px solid #f0f0f0",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(242,92,5,0.14)",
                    borderColor: "#ffb700",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    height: { xs: 100, sm: 120 },
                    bgcolor: "#fafafa",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={`${cat.name} — danh mục sản phẩm`}
                      fill
                      sizes="(max-width: 600px) 140px, 176px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <GridViewIcon sx={{ color: "#ccc", fontSize: 36 }} />
                    </Box>
                  )}

                  <Chip
                    label={`${productCount} SP`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      bgcolor: productCount > 0 ? "#f25c05" : "#9e9e9e",
                      color: "#fff",
                      fontSize: "0.6rem",
                      height: 18,
                    }}
                  />
                </Box>

                {/* Name */}
                <Box sx={{ px: 1.5, py: 1.2 }}>
                  <Tooltip title={cat.name} arrow placement="top">
                    <Typography
                      fontWeight={600}
                      noWrap
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.82rem" }, mb: 0.3 }}
                    >
                      {cat.name}
                    </Typography>
                  </Tooltip>
                  <Typography
                    variant="caption"
                    sx={{ color: "#f25c05", fontWeight: 600, opacity: productCount > 0 ? 1 : 0.35 }}
                  >
                    Xem ngay →
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Mobile swipe hint */}
      {isMobile && canScrollRight && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1,
            color: "#bbb",
            animation: "swipeHint 1.6s ease-in-out infinite",
            "@keyframes swipeHint": {
              "0%, 100%": { transform: "translateX(0)" },
              "50%": { transform: "translateX(-8px)" },
            },
          }}
        >
          ← Vuốt để xem thêm →
        </Typography>
      )}
    </Box>
  );
}
