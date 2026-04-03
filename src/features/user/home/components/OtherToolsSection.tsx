"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
  Container,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ProductCard from "@/features/user/products/components/ProductCard";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import deepEqual from "fast-deep-equal";
import { motion, AnimatePresence } from "framer-motion";
import type { CategoryWithProducts } from "@/features/user/home/types";

// Icons
import BuildIcon from "@mui/icons-material/Build";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InventoryIcon from "@mui/icons-material/Inventory";

interface OtherToolsSectionProps {
  categories: CategoryWithProducts[];
}

const OtherToolsSection: React.FC<OtherToolsSectionProps> = ({ categories }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState<
    CategoryWithProducts[]
  >([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // FILTER: Chỉ lấy danh mục có sản phẩm
  const categoriesWithProducts = React.useMemo(() => {
    return categories.filter((cat) => cat.products && cat.products.length > 0);
  }, [categories]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (!deepEqual(categoriesWithProducts, categoryProducts)) {
      setCategoryProducts(categoriesWithProducts);
      if (activeIndex >= categoriesWithProducts.length) {
        setActiveIndex(0);
      }
    }
  }, [categoriesWithProducts]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check scroll buttons visibility
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categoryProducts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const activeCategory = categoryProducts[activeIndex];

  // Animation variants - CHỈNH LẠI: Luôn visible, chỉ animate khi vào view
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // Nếu không có danh mục nào có sản phẩm
  if (categoryProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: "#fafafa",
              borderRadius: 4,
              maxWidth: 400,
              mx: "auto",
            }}
          >
            <InventoryIcon sx={{ fontSize: 60, color: "#ffb700", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có dụng cụ nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Các danh mục dụng cụ khác sẽ sớm được cập nhật
            </Typography>
          </Paper>
        </Box>
      </motion.div>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
      <Container maxWidth="xl">
        {/* Header với animation - SỬA: dùng whileInView thay vì animate có điều kiện */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemVariants}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
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
                  <BuildIcon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>
              </motion.div>
              <Box>
                <Typography variant="h5" fontWeight={800} color="#333">
                  Dụng cụ khác
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {categoryProducts.length} danh mục với{" "}
                  {categoryProducts.reduce(
                    (sum, cat) => sum + cat.products.length,
                    0,
                  )}{" "}
                  sản phẩm
                </Typography>
              </Box>
            </Box>

            {/* Category count badge */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Chip
                label={`${activeIndex + 1}/${categoryProducts.length} danh mục`}
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

        {/* Category Navigation với animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemVariants}
          transition={{ delay: 0.1 }}
        >
          <Box sx={{ position: "relative", mb: 4 }}>
            {/* Scroll buttons */}
            {!isMobile && canScrollLeft && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <IconButton
                  onClick={() => scroll("left")}
                  sx={{
                    position: "absolute",
                    left: -10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "#fff",
                    boxShadow: 3,
                    zIndex: 2,
                    "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </motion.div>
            )}

            {/* Category buttons container */}
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 1.5,
                px: { xs: 0, md: 2 },
                py: 1,
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {categoryProducts.map((cat, idx) => {
                const productCount = cat.products.length;
                const isActive = idx === activeIndex;

                return (
                  <motion.div
                    key={cat.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <Button
                      onClick={() => setActiveIndex(idx)}
                      sx={{
                        minWidth: "auto",
                        px: 2.5,
                        py: 1,
                        borderRadius: 3,
                        bgcolor: isActive ? "#f25c05" : "#fff",
                        color: isActive ? "#fff" : "#333",
                        border: "1px solid",
                        borderColor: isActive ? "#f25c05" : "#ffb700",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        boxShadow: isActive
                          ? "0 4px 12px rgba(242,92,5,0.2)"
                          : "none",
                        "&:hover": {
                          bgcolor: isActive ? "#e64a19" : "#fff8e1",
                          borderColor: "#f25c05",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {cat.name}
                      {productCount > 0 && (
                        <Chip
                          label={productCount}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: "0.65rem",
                            bgcolor: isActive ? "#fff" : "#ffb700",
                            color: isActive ? "#f25c05" : "#000",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </Box>

            {/* Scroll right button */}
            {!isMobile && canScrollRight && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <IconButton
                  onClick={() => scroll("right")}
                  sx={{
                    position: "absolute",
                    right: -10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "#fff",
                    boxShadow: 3,
                    zIndex: 2,
                    "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </motion.div>
            )}

            {/* Mobile hint */}
            {isMobile && categoryProducts.length > 3 && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 1,
                  color: "#bbb",
                  fontStyle: "italic",
                }}
              >
                Vuốt để xem thêm →
              </Typography>
            )}
          </Box>
        </motion.div>

        {/* Products Grid với animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeCategory?.products && activeCategory.products.length > 0 ? (
              <>
                <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                  {activeCategory.products.map((product, idx) => (
                    <Grid
                      key={product.id}
                      size={{
                        xs: 6,
                        sm: 4,
                        md: 3,
                        lg: 2.4,
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: Math.min(idx * 0.04, 0.2),
                          ease: "easeOut",
                        }}
                      >
                        <ProductCard
                          product={product}
                          mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${activeCategory?.slug}`}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* Xem tất cả button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Button
                      onClick={() =>
                        router.push(`/product?category=${activeCategory?.slug}`)
                      }
                      sx={{
                        color: "#f25c05",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "0.95rem",
                        "&:hover": {
                          "& .arrow": {
                            transform: "translateX(5px)",
                          },
                        },
                      }}
                    >
                      Xem tất cả {activeCategory?.name}
                      <ArrowForwardIcon
                        className="arrow"
                        sx={{
                          ml: 0.5,
                          fontSize: 18,
                          transition: "transform 0.3s",
                        }}
                      />
                    </Button>
                  </Box>
                </motion.div>
              </>
            ) : (
              // Empty state cho danh mục không có sản phẩm
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "#fafafa",
                    borderRadius: 4,
                  }}
                >
                  <InventoryIcon
                    sx={{ fontSize: 48, color: "#ffb700", mb: 2 }}
                  />
                  <Typography color="text.secondary" gutterBottom>
                    Danh mục này hiện chưa có sản phẩm
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vui lòng quay lại sau
                  </Typography>
                </Paper>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
};;

export default OtherToolsSection;
