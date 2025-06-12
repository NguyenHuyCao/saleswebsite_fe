"use client";

import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Fade,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  products?: { id: number }[];
  count: number;
}

interface Props {
  categories: Category[];
}

export default function ProductCategorySection({ categories }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateVisibility = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    updateVisibility();
    container.addEventListener("scroll", updateVisibility);
    window.addEventListener("resize", updateVisibility);
    return () => {
      container.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -260 : 260;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleClick = (slug?: string) => {
    if (slug) router.push(`/product?category=${slug}`);
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        pb: 6,
        position: "relative",
        bgcolor: "#fff",
      }}
    >
      {/* Scroll Buttons */}
      {isMdUp && showLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "#fff",
            zIndex: 3,
            boxShadow: 2,
            "&:hover": { bgcolor: "#fdf6e3" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          gap: 2,
          px: { xs: 1, sm: 4 },
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {categories.map((cat, idx) => (
          <Fade in timeout={400 + idx * 100} key={cat.id}>
            <Box
              onClick={() => handleClick(cat.slug)}
              sx={{
                flex: "0 0 auto",
                width: 220,
                height: 120,
                p: 2,
                bgcolor: "#fff",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                boxShadow: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  bgcolor: "#fffef7",
                },
              }}
            >
              <Box
                component="img"
                src={
                  cat.image
                    ? `http://localhost:8080/api/v1/files/${cat.image}`
                    : "/images/product/placeholder.jpg"
                }
                alt={`Danh mục ${cat.name}`}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "/images/product/placeholder.jpg";
                }}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  objectFit: "cover",
                  mr: 2,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ overflow: "hidden", flex: 1 }}>
                <Tooltip title={cat.name} arrow>
                  <Typography
                    fontWeight={600}
                    fontSize={15}
                    noWrap
                    sx={{
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cat.name}
                  </Typography>
                </Tooltip>
                <Typography
                  variant="caption"
                  color="primary"
                  fontStyle="italic"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  ({cat.products?.length || 0} sản phẩm)
                </Typography>
              </Box>
            </Box>
          </Fade>
        ))}
      </Box>

      {isMdUp && showRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "#fff",
            zIndex: 3,
            boxShadow: 2,
            "&:hover": { bgcolor: "#fdf6e3" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}
