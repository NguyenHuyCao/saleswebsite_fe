// components/home/ProductCategoryIntroSection.tsx
"use client";

import {
  Box,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  Container,
  Grid,
  Avatar,
  Chip,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ProductCategoryIntroSection({
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 1, 1]);

  const totalCategories = categories.length;
  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.products?.length || 0),
    0,
  );
  const activeCategories = categories.filter(
    (c) => (c.products?.length || 0) > 0,
  ).length;

  const stats = [
    {
      icon: <CategoryIcon />,
      value: totalCategories,
      label: "Danh mục",
      color: "#f25c05",
      bg: "rgba(242,92,5,0.1)",
    },
    {
      icon: <InventoryIcon />,
      value: totalProducts,
      label: "Sản phẩm",
      color: "#ffb700",
      bg: "rgba(255,183,0,0.1)",
    },
    {
      icon: <StarIcon />,
      value: activeCategories,
      label: "Đang kinh doanh",
      color: "#4caf50",
      bg: "rgba(76,175,80,0.1)",
    },
  ];

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      title: "Đa dạng chủng loại",
      description: "Từ máy cắt cỏ, máy cưa, máy khoan đến phụ kiện chính hãng",
    },
    {
      icon: <LocalOfferIcon sx={{ fontSize: 32 }} />,
      title: "Ưu đãi theo danh mục",
      description: "Giảm giá sâu cho từng nhóm sản phẩm riêng biệt",
    },
    {
      icon: <FlashOnIcon sx={{ fontSize: 32 }} />,
      title: "Cập nhật liên tục",
      description: "Sản phẩm mới nhất, công nghệ tiên tiến nhất",
    },
  ];

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(180deg, #fef7e9 0%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Content */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Chip
                label="DANH MỤC NỔI BẬT"
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
                  mb: 2,
                  lineHeight: 1.2,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Khám phá{" "}
                <Box component="span" sx={{ color: "#f25c05" }}>
                  {totalCategories}
                </Box>{" "}
                danh mục sản phẩm
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Từ các thương hiệu hàng đầu thế giới, đáp ứng mọi nhu cầu của
                bạn
              </Typography>

              {/* Stats Cards */}
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                {stats.map((stat, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2,
                      flex: 1,
                      bgcolor: stat.bg,
                      borderRadius: 3,
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: 40,
                        height: 40,
                        mx: "auto",
                        mb: 1,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={stat.color}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                ))}
              </Stack>

              {/* CTA Button */}
              <Button
                variant="contained"
                size="large"
                href="#category-section"
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  "&:hover": {
                    bgcolor: "#e64a19",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(242,92,5,0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Xem tất cả danh mục
                <ArrowForwardIcon sx={{ ml: 1, fontSize: 20 }} />
              </Button>
            </motion.div>
          </Grid>

          {/* Right Side - Features */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div style={{ y, opacity }}>
              <Grid container spacing={2}>
                {features.map((feature, idx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          height: "100%",
                          bgcolor: "#fef7e9",
                          borderRadius: 4,
                          border: "1px solid #ffb700",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 12px 24px rgba(255,183,0,0.2)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: "#fff",
                            width: 60,
                            height: 60,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                            color: "#f25c05",
                            border: "2px solid #ffb700",
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ mb: 1 }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Preview Categories */}
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: "#f5f5f5",
                  borderRadius: 4,
                  border: "1px dashed #ffb700",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Danh mục nổi bật:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {categories.slice(0, 6).map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.name}
                      size="small"
                      onClick={() =>
                        cat.slug &&
                        window.location.assign(`/product?category=${cat.slug}`)
                      }
                      sx={{
                        bgcolor: "#fff",
                        border: "1px solid #ffb700",
                        "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                      }}
                    />
                  ))}
                  {categories.length > 6 && (
                    <Chip
                      label={`+${categories.length - 6}`}
                      size="small"
                      sx={{ bgcolor: "#f25c05", color: "#fff" }}
                    />
                  )}
                </Stack>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
