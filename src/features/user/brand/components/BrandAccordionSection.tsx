"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Link,
  Chip,
  Stack,
  Paper,
  Button,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Brand, CategoryRef, ProductRef } from "@/features/user/brand/types";

import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InventoryIcon from "@mui/icons-material/Inventory";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";

type Props = { brands: Brand[] };

const TABS = ["Tổng quan", "Danh mục sản phẩm", "Sản phẩm tiêu biểu"];

export default function BrandAccordionSection({ brands }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedBrand, setSelectedBrand] = useState<number>(0);
  const [tabValue, setTabValue] = useState(0);

  const featuredBrands = brands
    .filter((b) => b.active !== false && b.productCount > 0)
    .slice(0, 6);
  const displayBrands = featuredBrands.length > 0 ? featuredBrands : brands.slice(0, 6);
  const currentBrand = displayBrands[selectedBrand];

  const allProducts: (ProductRef & { categoryName: string })[] =
    (currentBrand?.category ?? []).flatMap((cat) =>
      (cat.products ?? []).map((p) => ({ ...p, categoryName: cat.name })),
    );

  if (!brands || brands.length === 0 || !currentBrand) return null;

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Chip
          label="THƯƠNG HIỆU NỔI BẬT"
          size="small"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" }, mb: 2 }}
        >
          Khám phá{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            câu chuyện thương hiệu
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Tìm hiểu sâu hơn về các thương hiệu chính hãng và dòng sản phẩm phân phối
        </Typography>
      </Box>

      {/* Brand Selector Chips */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 4, flexWrap: "wrap", gap: 1, justifyContent: "center" }}
      >
        {displayBrands.map((brand, index) => (
          <Chip
            key={brand.id}
            avatar={
              <Avatar src={brand.logo} alt={brand.name}>
                {brand.name.charAt(0)}
              </Avatar>
            }
            label={brand.name}
            onClick={() => {
              setSelectedBrand(index);
              setTabValue(0);
            }}
            sx={{
              bgcolor: selectedBrand === index ? "#f25c05" : "action.selected",
              color: selectedBrand === index ? "#fff" : "text.primary",
              fontWeight: 600,
              px: 2,
              py: 3,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: selectedBrand === index ? "#e64a19" : "action.hover",
              },
            }}
          />
        ))}
      </Stack>

      {/* Main Content — key triggers CSS fade-in on brand change */}
      <Box
        key={selectedBrand}
        sx={{
          animation: "brandFadeIn 0.35s ease forwards",
          "@keyframes brandFadeIn": {
            from: { opacity: 0, transform: "translateY(12px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Grid container spacing={4}>
          {/* Left — Brand Info Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              {/* Logo + Name */}
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "background.default",
                    boxShadow: 2,
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={currentBrand.logo}
                    alt={currentBrand.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    {currentBrand.name}
                  </Typography>
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                    label="Chính hãng"
                    size="small"
                    sx={{ bgcolor: "#4caf50", color: "#fff", height: 22 }}
                  />
                </Box>
              </Stack>

              {/* Stats Row */}
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover", textAlign: "center" }}
                  >
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                      {currentBrand.productCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sản phẩm
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover", textAlign: "center" }}
                  >
                    <Typography variant="h6" fontWeight={700} color="secondary.main">
                      {currentBrand.category?.length ?? 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Danh mục
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Details */}
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <LocationOnIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                  <Typography variant="body2">
                    <strong>Quốc gia:</strong> {currentBrand.originCountry || "—"}
                  </Typography>
                </Stack>
                {currentBrand.year && (
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <CalendarTodayIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                    <Typography variant="body2">
                      <strong>Năm thành lập:</strong> {currentBrand.year}
                    </Typography>
                  </Stack>
                )}
                {currentBrand.website && (
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <LanguageIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                    <Link
                      href={currentBrand.website}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: "#f25c05",
                        textDecoration: "none",
                        fontSize: 14,
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {currentBrand.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </Link>
                  </Stack>
                )}
              </Stack>

              {/* Description */}
              {currentBrand.description && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: 3,
                    border: "1px dashed #ffb700",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontStyle="italic"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    "{currentBrand.description}"
                  </Typography>
                </Paper>
              )}

              {/* CTA */}
              <Button
                fullWidth
                variant="contained"
                onClick={() => router.push(`/product?brand=${currentBrand.slug}`)}
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: "#f25c05", color: "#fff", "&:hover": { bgcolor: "#e64a19" } }}
              >
                Xem sản phẩm {currentBrand.name}
              </Button>
            </Paper>
          </Grid>

          {/* Right — Tabs */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}
            >
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  mb: 3,
                  "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
                  "& .Mui-selected": { color: "#f25c05" },
                  "& .MuiTabs-indicator": { backgroundColor: "#f25c05" },
                }}
              >
                {TABS.map((t) => (
                  <Tab key={t} label={t} />
                ))}
              </Tabs>

              {/* Tab 0: Overview */}
              {tabValue === 0 && (
                <Stack spacing={2}>
                  <Typography variant="subtitle1" fontWeight={700} color="#f25c05">
                    Giới thiệu về {currentBrand.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {currentBrand.description ||
                      `${currentBrand.name} là thương hiệu chính hãng được phân phối tại Cường Hoa. Chúng tôi cung cấp ${currentBrand.productCount} sản phẩm với đầy đủ bảo hành.`}
                  </Typography>

                  {currentBrand.category.length > 0 && (
                    <>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>
                        Danh mục phân phối:
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {currentBrand.category.map((cat) => (
                          <Chip
                            key={cat.id}
                            icon={<CategoryIcon sx={{ fontSize: 14 }} />}
                            label={`${cat.name} (${cat.products?.length ?? 0})`}
                            size="small"
                            variant="outlined"
                            onClick={() => router.push(`/product?category=${cat.slug}`)}
                            sx={{
                              cursor: "pointer",
                              "&:hover": { borderColor: "#f25c05", color: "#f25c05" },
                            }}
                          />
                        ))}
                      </Stack>
                    </>
                  )}
                </Stack>
              )}

              {/* Tab 1: Categories */}
              {tabValue === 1 && (
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" fontWeight={700} color="#f25c05">
                    Danh mục sản phẩm ({currentBrand.category.length})
                  </Typography>
                  {currentBrand.category.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có danh mục sản phẩm
                    </Typography>
                  ) : (
                    currentBrand.category.map((cat: CategoryRef) => (
                      <Paper
                        key={cat.id}
                        elevation={0}
                        onClick={() =>
                          router.push(
                            `/product?brand=${currentBrand.slug}&category=${cat.slug}`,
                          )
                        }
                        sx={{
                          p: 2,
                          bgcolor: "action.hover",
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "action.selected" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <InventoryIcon sx={{ color: "#f25c05", flexShrink: 0 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {cat.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {cat.products?.length ?? 0} sản phẩm
                          </Typography>
                        </Box>
                        <ArrowForwardIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                      </Paper>
                    ))
                  )}
                </Stack>
              )}

              {/* Tab 2: Featured Products */}
              {tabValue === 2 && (
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" fontWeight={700} color="#f25c05">
                    Sản phẩm tiêu biểu ({Math.min(allProducts.length, 8)}/{allProducts.length})
                  </Typography>
                  {allProducts.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có sản phẩm nào
                    </Typography>
                  ) : (
                    <>
                      {allProducts.slice(0, 8).map((p) => (
                        <Paper
                          key={p.id}
                          elevation={0}
                          onClick={() => router.push(`/product/detail?name=${p.slug}`)}
                          sx={{
                            p: 1.5,
                            bgcolor: "action.hover",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            cursor: "pointer",
                            "&:hover": { bgcolor: "action.selected" },
                            transition: "background-color 0.2s",
                          }}
                        >
                          <ShoppingBagIcon sx={{ color: "#f25c05", fontSize: 18, flexShrink: 0 }} />
                          <Box sx={{ flex: 1, overflow: "hidden" }}>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {p.categoryName}
                            </Typography>
                          </Box>
                          <ArrowForwardIcon
                            sx={{ fontSize: 14, color: "text.disabled", flexShrink: 0 }}
                          />
                        </Paper>
                      ))}
                      {allProducts.length > 8 && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => router.push(`/product?brand=${currentBrand.slug}`)}
                          endIcon={<ArrowForwardIcon />}
                          sx={{ borderColor: "#ffb700", color: "#f25c05", mt: 1 }}
                        >
                          Xem tất cả {allProducts.length} sản phẩm
                        </Button>
                      )}
                    </>
                  )}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Banner */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 4,
          border: "1px solid #ffb700",
          background: "linear-gradient(135deg, rgba(255,183,0,0.06), transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <StorefrontIcon sx={{ color: "#f25c05", fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Tất cả {brands.length} thương hiệu chính hãng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {brands.reduce((s, b) => s + (b.productCount ?? 0), 0)} sản phẩm đang có tại cửa hàng
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => router.push("/product")}
          sx={{
            borderColor: "#ffb700",
            color: "#f25c05",
            "&:hover": { borderColor: "#f25c05", bgcolor: "rgba(242,92,5,0.04)" },
          }}
        >
          Xem tất cả sản phẩm
        </Button>
      </Paper>
    </Box>
  );
}
