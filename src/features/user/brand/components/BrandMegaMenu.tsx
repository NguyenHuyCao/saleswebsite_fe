"use client";

import { Box, Typography, Chip } from "@mui/material";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface Product {
  id: number;
  name: string;
  slug?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  category: Category[];
}

interface Props {
  brands: Brand[];
  categories: Category[];
}

const MotionBox = motion(Box);
const MAX_PRODUCTS = 5;

const BrandMegaMenu = ({ brands }: Props) => {
  const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);
  const [displayBrand, setDisplayBrand] = useState<Brand | null>(null);
  const router = useRouter();
  const hideTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounce hiding right panel 180ms so mouse can travel from brand list
  // to the right panel without triggering onMouseLeave on the outer Box
  const enterBrand = (id: number) => {
    clearTimeout(hideTimerRef.current);
    setHoveredBrandId(id);
  };
  const leaveBrands = () => {
    hideTimerRef.current = setTimeout(() => setHoveredBrandId(null), 180);
  };
  const keepPanel = () => clearTimeout(hideTimerRef.current);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  const visibleBrands = brands.filter((brand) =>
    brand.category.some((cat) => cat.products && cat.products.length > 0)
  );

  const hoveredBrand =
    hoveredBrandId !== null
      ? visibleBrands.find((b) => b.id === hoveredBrandId) ?? null
      : null;

  useEffect(() => {
    if (hoveredBrand) setDisplayBrand(hoveredBrand);
  }, [hoveredBrand]);

  const activeCats = displayBrand
    ? displayBrand.category.filter((cat) => cat.products.length > 0)
    : [];
  const totalProducts = activeCats.reduce((s, c) => s + c.products.length, 0);
  const isRightVisible = hoveredBrand !== null;

  return (
    <Box
      display="flex"
      onMouseLeave={leaveBrands}
      sx={{
        position: "relative",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        // Must cover brand list (250px) + right panel (minWidth 900px) so
        // onMouseLeave doesn't fire when moving horizontally to the right panel
        minWidth: 1150,
      }}
    >
      {/* LEFT: BRAND LIST — stagger khi menu mở */}
      <Box sx={{ bgcolor: "#111", color: "white", width: 250, flexShrink: 0, py: 0.5 }}>
        {visibleBrands.map((brand, index) => {
          const isActive = hoveredBrandId === brand.id;
          return (
            <MotionBox
              key={brand.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.04,
                duration: 0.2,
                ease: "easeOut",
              }}
              onMouseEnter={() => enterBrand(brand.id)}
              onClick={() => router.push(`/product?brand=${brand.slug}`)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.1,
                cursor: "pointer",
                bgcolor: isActive ? "#f25c05" : "transparent",
                borderLeft: isActive
                  ? "3px solid #ffb700"
                  : "3px solid transparent",
                transition: "background 0.15s ease, border-color 0.15s ease",
                "&:hover": { bgcolor: "#f25c05", borderLeftColor: "#ffb700" },
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.15s",
                  }}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={26}
                    height={26}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Typography
                  fontSize={13.5}
                  fontWeight={isActive ? 700 : 400}
                  sx={{ transition: "font-weight 0.1s" }}
                >
                  {brand.name}
                </Typography>
              </Box>

              {/* Arrow shifts right on hover */}
              <motion.div
                animate={{ x: isActive ? 2 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronRightIcon sx={{ fontSize: 15, opacity: 0.65 }} />
              </motion.div>
            </MotionBox>
          );
        })}
      </Box>

      {/* RIGHT: CATEGORIES + PRODUCTS */}
      <Box
        onMouseEnter={keepPanel}
        sx={{
          position: "absolute",
          left: 250,
          top: 0,
          minWidth: 900,
          bgcolor: "white",
          borderTop: "3px solid #ffb700",
          boxShadow: "4px 4px 24px rgba(0,0,0,0.12)",
          // Outer panel fades with CSS — inner content uses AnimatePresence
          opacity: isRightVisible ? 1 : 0,
          transition: "opacity 0.18s ease",
          pointerEvents: isRightVisible ? "auto" : "none",
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        {/* AnimatePresence keyed by brand.id — content slides when brand switches */}
        <AnimatePresence mode="wait">
          {displayBrand && (
            <motion.div
              key={displayBrand.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {/* Brand header */}
              <Box
                sx={{
                  px: 3,
                  py: 1.4,
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#fafafa",
                  minHeight: 56,
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Image
                    src={displayBrand.logo}
                    alt={displayBrand.name}
                    width={34}
                    height={34}
                    style={{ objectFit: "contain" }}
                  />
                  <Typography fontWeight={800} fontSize={15} color="#111">
                    {displayBrand.name}
                  </Typography>
                  <Chip
                    label={`${totalProducts} sản phẩm`}
                    size="small"
                    sx={{
                      bgcolor: "#fff3e0",
                      color: "#f25c05",
                      fontWeight: 700,
                      fontSize: 11,
                      height: 20,
                      border: "1px solid #ffe0b2",
                    }}
                  />
                </Box>
                <Box
                  component={motion.div}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.12 }}
                  onClick={() =>
                    router.push(`/product?brand=${displayBrand.slug}`)
                  }
                  sx={{
                    fontSize: 12,
                    color: "#f25c05",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Xem tất cả <OpenInNewIcon sx={{ fontSize: 13 }} />
                </Box>
              </Box>

              {/* Category grid — stagger per brand switch */}
              <Box
                sx={{
                  p: 2.5,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 3,
                  maxHeight: 380,
                  overflowY: "auto",
                  "&::-webkit-scrollbar": { width: 4 },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "#e0e0e0",
                    borderRadius: 4,
                  },
                }}
              >
                {activeCats.map((cat, idx) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: idx * 0.055,
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    {/* Category title */}
                    <Box
                      onClick={() =>
                        router.push(
                          `/product?brand=${displayBrand?.slug}&category=${cat.slug}`
                        )
                      }
                      sx={{ cursor: "pointer", mb: 1, display: "inline-block" }}
                    >
                      <Typography
                        fontWeight={700}
                        fontSize={11.5}
                        color="#f25c05"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: ".6px",
                          borderBottom: "2px solid #ffb700",
                          pb: 0.4,
                          transition: "color 0.15s",
                          "&:hover": { color: "#c0392b" },
                        }}
                      >
                        {cat.name}
                      </Typography>
                    </Box>

                    {/* Product list */}
                    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                      {cat.products.slice(0, MAX_PRODUCTS).map((p) => (
                        <li key={p.id} style={{ listStyle: "none" }}>
                          <MotionBox
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.12 }}
                            onClick={() =>
                              router.push(`/product/detail?name=${p.slug}`)
                            }
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 0.8,
                              py: 0.5,
                              px: 0.5,
                              cursor: "pointer",
                              borderRadius: 1,
                              transition: "background 0.15s, color 0.15s",
                              "&:hover": {
                                bgcolor: "#fff4e5",
                                "& .arrow": { color: "#f25c05" },
                                "& .name": { color: "#f25c05" },
                              },
                            }}
                          >
                            <Box
                              className="arrow"
                              component="span"
                              sx={{
                                color: "#ffb700",
                                fontSize: 9,
                                flexShrink: 0,
                                mt: "4px",
                                transition: "color 0.15s",
                              }}
                            >
                              ▶
                            </Box>
                            <Typography
                              className="name"
                              component="span"
                              sx={{
                                fontSize: 13,
                                color: "#333",
                                lineHeight: 1.4,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                transition: "color 0.15s",
                              }}
                            >
                              {p.name}
                            </Typography>
                          </MotionBox>
                        </li>
                      ))}

                      {cat.products.length > MAX_PRODUCTS && (
                        <Box
                          component={motion.div}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.12 }}
                          onClick={() =>
                            router.push(
                              `/product?brand=${displayBrand?.slug}&category=${cat.slug}`
                            )
                          }
                          sx={{
                            mt: 0.5,
                            ml: 1,
                            fontSize: 12,
                            color: "#1565c0",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                            fontWeight: 600,
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
                          Xem thêm {cat.products.length - MAX_PRODUCTS} sản phẩm
                        </Box>
                      )}
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default BrandMegaMenu;
