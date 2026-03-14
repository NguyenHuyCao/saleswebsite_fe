"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Container,
  Chip,
  IconButton,
  Pagination,
  Skeleton,
  Fade,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";

// Icons
import StorefrontIcon from "@mui/icons-material/Storefront";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import type { Brand } from "@/features/user/brand/types";

type Props = {
  brands: Brand[];
  loading?: boolean;
};

// Map quốc gia với màu sắc
const countryColors: Record<string, string> = {
  VN: "#f25c05",
  USA: "#2196f3",
  China: "#f44336",
  "South Korea": "#4caf50",
  Japan: "#9c27b0",
};

export default function BrandListSection({ brands, loading = false }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [page, setPage] = useState(1);
  // FIX: So sánh đúng type (number với number)
  const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "country">("name");

  const ITEMS_PER_PAGE = isMobile ? 4 : 6;

  // Tính số lượng sản phẩm cho mỗi brand (từ category.products)
  const brandsWithProductCount = useMemo(() => {
    return brands.map((brand) => ({
      ...brand,
      productCount:
        brand.category?.reduce(
          (total, cat) => total + (cat.products?.length || 0),
          0,
        ) || 0,
    }));
  }, [brands]);

  // Sắp xếp brands
  const sortedBrands = useMemo(() => {
    const sorted = [...brandsWithProductCount];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) =>
        (a.originCountry || "").localeCompare(b.originCountry || ""),
      );
    }
    return sorted;
  }, [brandsWithProductCount, sortBy]);

  // Tính toán số trang
  const totalPages = Math.ceil(sortedBrands.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentBrands = sortedBrands.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Animation variants - GIẢM NHẸ
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: i * 0.05,
      },
    }),
  };

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Skeleton
          variant="text"
          width={300}
          height={50}
          sx={{ mx: "auto", mb: 4 }}
        />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton
                variant="rounded"
                height={180}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // Empty state
  if (!brands || brands.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "#fafafa",
            borderRadius: 4,
            border: "2px dashed #ffb700",
          }}
        >
          <StorefrontIcon sx={{ fontSize: 60, color: "#ffb700", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có thương hiệu nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Các thương hiệu sẽ sớm được cập nhật
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <motion.div variants={headerVariants}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 4, gap: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: "#f25c05",
                    width: 56,
                    height: 56,
                  }}
                >
                  <StorefrontIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#333">
                    Thương hiệu
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" color="text.secondary">
                      {brands.length} thương hiệu chính hãng
                    </Typography>
                    <Chip
                      size="small"
                      label="100% authentic"
                      sx={{
                        bgcolor: "#4caf50",
                        color: "#fff",
                        fontSize: "0.6rem",
                        height: 20,
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>

              {/* Sort controls */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant={sortBy === "name" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setSortBy("name")}
                  sx={{
                    textTransform: "none",
                    bgcolor: sortBy === "name" ? "#f25c05" : "transparent",
                    color: sortBy === "name" ? "#fff" : "#666",
                    borderColor: "#ffb700",
                  }}
                >
                  Theo tên
                </Button>
                <Button
                  variant={sortBy === "country" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setSortBy("country")}
                  sx={{
                    textTransform: "none",
                    bgcolor: sortBy === "country" ? "#f25c05" : "transparent",
                    color: sortBy === "country" ? "#fff" : "#666",
                    borderColor: "#ffb700",
                  }}
                >
                  Theo quốc gia
                </Button>
              </Stack>
            </Stack>
          </motion.div>

          {/* Brands Grid */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {currentBrands.map((brand, index) => {
              const country = brand.originCountry || "Unknown";
              const countryColor = countryColors[country] || "#999";
              const isHovered = hoveredBrandId === brand.id;

              return (
                <Grid key={brand.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <motion.div
                    variants={cardVariants}
                    custom={index}
                    whileHover={{ y: -4 }} // GIẢM từ -8 xuống -4
                    onHoverStart={() => setHoveredBrandId(brand.id)}
                    onHoverEnd={() => setHoveredBrandId(null)}
                  >
                    <Paper
                      elevation={isHovered ? 3 : 1} // GIẢM từ 6 xuống 3
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        height: "100%",
                        cursor: "pointer",
                        transition: "all 0.2s ease", // NHANH HƠN
                        border: isHovered
                          ? "1.5px solid #f25c05" // GIẢM từ 2px xuống 1.5px
                          : "1px solid #f0f0f0",
                        position: "relative",
                        overflow: "hidden",
                        bgcolor: "#fff",
                      }}
                      onClick={() =>
                        router.push(`/product?brand=${brand.slug || brand.id}`)
                      }
                    >
                      {/* Country color bar - NHẸ HƠN */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: 3, // GIẢM từ 4px xuống 3px
                          bgcolor: countryColor,
                          opacity: isHovered ? 1 : 0.7, // MỜ HƠN KHI KHÔNG HOVER
                        }}
                      />

                      {/* Content */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        {/* Logo */}
                        <Box
                          sx={{
                            width: 60, // GIẢM từ 70 xuống 60
                            height: 60,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "#f5f5f5",
                            boxShadow: isHovered
                              ? "0 4px 12px rgba(242,92,5,0.1)" // NHẸ HƠN
                              : "0 2px 4px rgba(0,0,0,0.05)",
                            transition: "all 0.2s ease",
                            position: "relative",
                          }}
                        >
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            sizes="60px"
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.2s ease",
                              transform: isHovered ? "scale(1.05)" : "scale(1)", // GIẢM từ 1.1 xuống 1.05
                            }}
                          />
                        </Box>

                        {/* Info */}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight={600} // GIẢM từ 700 xuống 600
                            sx={{
                              fontSize: "1rem",
                              color: isHovered ? "#f25c05" : "#333",
                              mb: 0.5,
                            }}
                          >
                            {brand.name}
                          </Typography>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <PublicIcon
                              sx={{ fontSize: 14, color: countryColor }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: countryColor,
                                fontWeight: 500,
                                fontSize: "0.85rem",
                              }}
                            >
                              {country}
                            </Typography>
                          </Stack>

                          {/* Product count badge */}
                          {brand.productCount > 0 && (
                            <Chip
                              label={`${brand.productCount} sản phẩm`}
                              size="small"
                              sx={{
                                mt: 1,
                                bgcolor: "#f5f5f5",
                                height: 20,
                                fontSize: "0.6rem",
                              }}
                            />
                          )}
                        </Box>

                        {/* Arrow icon */}
                        <ArrowForwardIcon
                          sx={{
                            fontSize: 18,
                            color: isHovered ? "#f25c05" : "#ccc",
                            transition: "all 0.2s ease",
                            transform: isHovered ? "translateX(3px)" : "none", // GIẢM từ 5px xuống 3px
                          }}
                        />
                      </Stack>
                    </Paper>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Fade in timeout={800}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ mt: 5 }}
              >
                <IconButton
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  size="small"
                >
                  <ChevronLeftIcon />
                </IconButton>

                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  size={isMobile ? "small" : "medium"}
                />

                <IconButton
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  size="small"
                >
                  <ChevronRightIcon />
                </IconButton>
              </Stack>
            </Fade>
          )}
        </Container>
      </Box>
    </motion.div>
  );
}
