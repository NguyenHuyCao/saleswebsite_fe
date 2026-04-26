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
  Chip,
  IconButton,
  Pagination,
  Fade,
  Avatar,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useRouter } from "next/navigation";

import StorefrontIcon from "@mui/icons-material/Storefront";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import type { Brand } from "@/features/user/brand/types";

type Props = {
  brands: Brand[];
  loading?: boolean;
};

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

  const [page, setPage] = useState(1);
  const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "country">("name");

  const ITEMS_PER_PAGE = isMobile ? 4 : 6;

  const sortedBrands = useMemo(() => {
    const sorted = [...brands];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) =>
        (a.originCountry || "").localeCompare(b.originCountry || ""),
      );
    }
    return sorted;
  }, [brands, sortBy]);

  const totalPages = Math.ceil(sortedBrands.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentBrands = sortedBrands.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <Skeleton variant="text" width={300} height={50} sx={{ mx: "auto", mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={90} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <Box sx={{ py: 6 }}>
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
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4, gap: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "#f25c05", width: 56, height: 56 }}>
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
                sx={{ bgcolor: "#4caf50", color: "#fff", fontSize: "0.6rem", height: 20 }}
              />
            </Stack>
          </Box>
        </Stack>

        {/* Sort controls */}
        <Stack direction="row" spacing={1}>
          <Button
            variant={sortBy === "name" ? "contained" : "outlined"}
            size="small"
            onClick={() => { setSortBy("name"); setPage(1); }}
            sx={{
              textTransform: "none",
              bgcolor: sortBy === "name" ? "#f25c05" : "transparent",
              color: sortBy === "name" ? "#fff" : "#666",
              borderColor: "#ffb700",
              "&:hover": { bgcolor: sortBy === "name" ? "#e64a19" : "rgba(255,183,0,0.08)" },
            }}
          >
            Theo tên
          </Button>
          <Button
            variant={sortBy === "country" ? "contained" : "outlined"}
            size="small"
            onClick={() => { setSortBy("country"); setPage(1); }}
            sx={{
              textTransform: "none",
              bgcolor: sortBy === "country" ? "#f25c05" : "transparent",
              color: sortBy === "country" ? "#fff" : "#666",
              borderColor: "#ffb700",
              "&:hover": { bgcolor: sortBy === "country" ? "#e64a19" : "rgba(255,183,0,0.08)" },
            }}
          >
            Theo quốc gia
          </Button>
        </Stack>
      </Stack>

      {/* Brands Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {currentBrands.map((brand) => {
          const country = brand.originCountry || "Unknown";
          const countryColor = countryColors[country] || "#999";
          const isHovered = hoveredBrandId === brand.id;

          return (
            <Grid key={brand.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={isHovered ? 3 : 1}
                onMouseEnter={() => setHoveredBrandId(brand.id)}
                onMouseLeave={() => setHoveredBrandId(null)}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: isHovered ? "1.5px solid #f25c05" : "1px solid #f0f0f0",
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: "#fff",
                  transform: isHovered ? "translateY(-4px)" : "none",
                }}
                onClick={() => router.push(`/product?brand=${brand.slug || brand.id}`)}
              >
                {/* Country color bar */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 3,
                    bgcolor: countryColor,
                    opacity: isHovered ? 1 : 0.6,
                  }}
                />

                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Logo */}
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#f5f5f5",
                      boxShadow: isHovered
                        ? "0 4px 12px rgba(242,92,5,0.1)"
                        : "0 2px 4px rgba(0,0,0,0.05)",
                      transition: "all 0.2s ease",
                      position: "relative",
                      flexShrink: 0,
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
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        fontSize: "1rem",
                        color: isHovered ? "#f25c05" : "#333",
                        mb: 0.5,
                        transition: "color 0.2s",
                      }}
                    >
                      {brand.name}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PublicIcon sx={{ fontSize: 14, color: countryColor }} />
                      <Typography
                        variant="body2"
                        sx={{ color: countryColor, fontWeight: 500, fontSize: "0.85rem" }}
                      >
                        {country}
                      </Typography>
                    </Stack>

                    {brand.productCount > 0 && (
                      <Chip
                        label={`${brand.productCount} sản phẩm`}
                        size="small"
                        sx={{ mt: 1, bgcolor: "#f5f5f5", height: 20, fontSize: "0.6rem" }}
                      />
                    )}
                  </Box>

                  {/* Arrow */}
                  <ArrowForwardIcon
                    sx={{
                      fontSize: 18,
                      color: isHovered ? "#f25c05" : "#ccc",
                      transition: "all 0.2s ease",
                      transform: isHovered ? "translateX(3px)" : "none",
                      flexShrink: 0,
                    }}
                  />
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Fade in timeout={600}>
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
    </Box>
  );
}
