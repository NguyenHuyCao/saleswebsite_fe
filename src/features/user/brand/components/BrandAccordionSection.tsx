"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Link,
  Container,
  Chip,
  Stack,
  Paper,
  Button,
  Tab,
  Tabs,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardMedia,
  Fade,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Brand } from "@/features/user/brand/types";

// Icons
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InventoryIcon from "@mui/icons-material/Inventory";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BuildIcon from "@mui/icons-material/Build";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

type Props = { brands: Brand[] };

// Mock data cho các dòng sản phẩm chính (có thể lấy từ API sau)
const brandFeatures: Record<string, any> = {
  Sony: {
    specialties: ["Máy khoan pin", "Máy cắt cỏ", "Phụ kiện"],
    technologies: ["X-TORQUE", "Brushless Motor", "Smart Control"],
    achievements: ["Top 1 thị trường Nhật", "Giải thưởng Design 2023"],
    productLines: ["Professional Series", "Home Series", "Compact Series"],
  },
  Makita: {
    specialties: ["Máy cưa xích", "Máy mài góc", "Máy đánh bóng"],
    technologies: ["Star Protection", "Auto-Start", "XPT"],
    achievements: ["Công nghệ pin hàng đầu", "20+ năm kinh nghiệm"],
    productLines: ["LXT Series", "CXT Series", "XGT Series"],
  },
  DeWALT: {
    specialties: ["Máy khoan búa", "Máy cắt sắt", "Máy rửa áp lực"],
    technologies: ["Power Detect", "FlexVolt", "XR Brushless"],
    achievements: ["Bền bỉ nhất thị trường", "Bảo hành 3 năm"],
    productLines: ["20V MAX", "FlexVolt", "Atomic Series"],
  },
};

// Brand categories
const categories = ["Tổng quan", "Dòng sản phẩm", "Công nghệ", "Thành tựu"];

export default function BrandAccordionSection({ brands }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [selectedBrand, setSelectedBrand] = useState<number>(0);
  const [tabValue, setTabValue] = useState(0);
  const [expandedBrand, setExpandedBrand] = useState<number | null>(null);

  // Chỉ lấy 4 thương hiệu nổi bật (có thể sắp xếp theo logic riêng)
  const featuredBrands = brands.slice(0, 4);
  const currentBrand = featuredBrands[selectedBrand];
  const brandFeature = brandFeatures[currentBrand?.name] || {
    specialties: ["Đa dạng sản phẩm"],
    technologies: ["Công nghệ tiên tiến"],
    achievements: ["Uy tín toàn cầu"],
    productLines: ["Dòng cao cấp", "Dòng phổ thông"],
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  if (!brands || brands.length === 0) return null;

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
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Chip
                label="THƯƠNG HIỆU NỔI BẬT"
                size="small"
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  mb: 2,
                }}
              >
                Khám phá{" "}
                <Box component="span" sx={{ color: "#ffb700" }}>
                  câu chuyện thương hiệu
                </Box>
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                Tìm hiểu sâu hơn về các thương hiệu hàng đầu và công nghệ độc
                quyền
              </Typography>
            </Box>
          </motion.div>

          {/* Brand Selector - Tabs hoặc Chips */}
          <motion.div variants={itemVariants}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mb: 4,
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "center",
              }}
            >
              {featuredBrands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
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
                      bgcolor: selectedBrand === index ? "#f25c05" : "#f5f5f5",
                      color: selectedBrand === index ? "#fff" : "#333",
                      fontWeight: 600,
                      px: 2,
                      py: 3,
                      "&:hover": {
                        bgcolor:
                          selectedBrand === index ? "#e64a19" : "#e0e0e0",
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBrand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={4}>
                {/* Left - Brand Info */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      bgcolor: "#fafafa",
                      border: "1px solid #f0f0f0",
                      height: "100%",
                    }}
                  >
                    {/* Logo and Basic Info */}
                    <Stack
                      direction="row"
                      spacing={3}
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 3,
                          overflow: "hidden",
                          bgcolor: "#fff",
                          boxShadow: 2,
                          position: "relative",
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
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          sx={{ mb: 1 }}
                        >
                          {currentBrand.name}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                            label="Chính hãng"
                            size="small"
                            sx={{
                              bgcolor: "#4caf50",
                              color: "#fff",
                              height: 22,
                            }}
                          />
                          <Chip
                            label="Top 1 thị trường"
                            size="small"
                            sx={{
                              bgcolor: "#ffb700",
                              color: "#000",
                              height: 22,
                            }}
                          />
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Details */}
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <LocationOnIcon sx={{ color: "#999", fontSize: 20 }} />
                        <Typography variant="body2">
                          <strong>Quốc gia:</strong>{" "}
                          {currentBrand.originCountry}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <CalendarTodayIcon
                          sx={{ color: "#999", fontSize: 20 }}
                        />
                        <Typography variant="body2">
                          <strong>Năm thành lập:</strong>{" "}
                          {currentBrand.year || "Chưa rõ"}
                        </Typography>
                      </Stack>
                      {currentBrand.website && (
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <LanguageIcon sx={{ color: "#999", fontSize: 20 }} />
                          <Link
                            href={currentBrand.website}
                            target="_blank"
                            rel="noopener"
                            sx={{ color: "#f25c05", textDecoration: "none" }}
                          >
                            {currentBrand.website}
                          </Link>
                        </Stack>
                      )}
                    </Stack>

                    {/* Description */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#fff",
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
                        "
                        {currentBrand.description ||
                          "Thương hiệu hàng đầu với nhiều năm kinh nghiệm trong lĩnh vực dụng cụ cơ khí."}
                        "
                      </Typography>
                    </Paper>

                    {/* Rating */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Rating value={4.5} readOnly precision={0.5} />
                      <Typography variant="body2" color="text.secondary">
                        (128 đánh giá)
                      </Typography>
                    </Stack>

                    {/* CTA */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() =>
                        window.open(
                          `/product?brand=${currentBrand.slug}`,
                          "_blank",
                        )
                      }
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        mt: 3,
                        bgcolor: "#f25c05",
                        color: "#fff",
                        "&:hover": { bgcolor: "#e64a19" },
                      }}
                    >
                      Xem sản phẩm {currentBrand.name}
                    </Button>
                  </Paper>
                </Grid>

                {/* Right - Tabs Content */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      border: "1px solid #f0f0f0",
                      height: "100%",
                    }}
                  >
                    {/* Tabs */}
                    <Tabs
                      value={tabValue}
                      onChange={handleChangeTab}
                      variant={isMobile ? "scrollable" : "fullWidth"}
                      scrollButtons={isMobile ? "auto" : false}
                      sx={{
                        mb: 3,
                        "& .MuiTab-root": {
                          fontWeight: 600,
                          textTransform: "none",
                        },
                        "& .Mui-selected": {
                          color: "#f25c05",
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#f25c05",
                        },
                      }}
                    >
                      {categories.map((cat) => (
                        <Tab key={cat} label={cat} />
                      ))}
                    </Tabs>

                    {/* Tab Panels */}
                    <Box sx={{ mt: 2 }}>
                      {tabValue === 0 && (
                        <Stack spacing={2}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="#f25c05"
                          >
                            Dòng sản phẩm chính
                          </Typography>
                          <Grid container spacing={2}>
                            {brandFeature.specialties.map(
                              (item: string, idx: number) => (
                                <Grid key={idx} size={{ xs: 6, sm: 4 }}>
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 2,
                                      bgcolor: "#f5f5f5",
                                      borderRadius: 3,
                                      textAlign: "center",
                                      "&:hover": {
                                        bgcolor: "#fff8f0",
                                        cursor: "pointer",
                                      },
                                    }}
                                  >
                                    <BuildIcon
                                      sx={{ color: "#f25c05", mb: 1 }}
                                    />
                                    <Typography
                                      variant="body2"
                                      fontWeight={500}
                                    >
                                      {item}
                                    </Typography>
                                  </Paper>
                                </Grid>
                              ),
                            )}
                          </Grid>
                        </Stack>
                      )}

                      {tabValue === 1 && (
                        <Stack spacing={2}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="#f25c05"
                          >
                            Các dòng sản phẩm
                          </Typography>
                          {brandFeature.productLines.map(
                            (line: string, idx: number) => (
                              <Paper
                                key={idx}
                                elevation={0}
                                sx={{
                                  p: 2,
                                  bgcolor: "#f5f5f5",
                                  borderRadius: 3,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <InventoryIcon sx={{ color: "#f25c05" }} />
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {line}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {idx === 0
                                      ? "Cao cấp nhất"
                                      : idx === 1
                                        ? "Phổ thông"
                                        : "Tiết kiệm"}
                                  </Typography>
                                </Box>
                              </Paper>
                            ),
                          )}
                        </Stack>
                      )}

                      {tabValue === 2 && (
                        <Stack spacing={2}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="#f25c05"
                          >
                            Công nghệ độc quyền
                          </Typography>
                          {brandFeature.technologies.map(
                            (tech: string, idx: number) => (
                              <Chip
                                key={idx}
                                label={tech}
                                sx={{
                                  bgcolor: "#f5f5f5",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              />
                            ),
                          )}
                        </Stack>
                      )}

                      {tabValue === 3 && (
                        <Stack spacing={2}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="#f25c05"
                          >
                            Thành tựu nổi bật
                          </Typography>
                          {brandFeature.achievements.map(
                            (achievement: string, idx: number) => (
                              <Paper
                                key={idx}
                                elevation={0}
                                sx={{
                                  p: 2,
                                  bgcolor: "#f5f5f5",
                                  borderRadius: 3,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <EmojiEventsIcon sx={{ color: "#ffb700" }} />
                                <Typography variant="body2">
                                  {achievement}
                                </Typography>
                              </Paper>
                            ),
                          )}
                        </Stack>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          </AnimatePresence>

          {/* Comparison Banner */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 3,
                bgcolor: "linear-gradient(135deg, #fff8f0, #fff)",
                borderRadius: 4,
                border: "1px solid #ffb700",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <EmojiEventsIcon sx={{ color: "#f25c05", fontSize: 32 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    So sánh các thương hiệu
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Xem bảng so sánh chi tiết về công nghệ, giá cả và đánh giá
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => window.open("/compare-brands", "_blank")}
                sx={{
                  borderColor: "#ffb700",
                  color: "#f25c05",
                  "&:hover": {
                    borderColor: "#f25c05",
                    bgcolor: "#fff8f0",
                  },
                }}
              >
                So sánh ngay
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
}
