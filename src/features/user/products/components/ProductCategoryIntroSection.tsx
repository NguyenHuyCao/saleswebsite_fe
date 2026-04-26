"use client";

import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Grid,
  Avatar,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const totalCategories = categories.length;
  const totalProducts = categories.reduce((s, c) => s + (c.products?.length || 0), 0);
  const activeCategories = categories.filter((c) => (c.products?.length || 0) > 0).length;

  const stats = [
    { icon: <CategoryIcon />, value: totalCategories, label: "Danh mục", color: "#f25c05", bg: "rgba(242,92,5,0.08)" },
    { icon: <InventoryIcon />, value: totalProducts, label: "Sản phẩm", color: "#ffb700", bg: "rgba(255,183,0,0.08)" },
    { icon: <StarIcon />, value: activeCategories, label: "Đang KD", color: "#4caf50", bg: "rgba(76,175,80,0.08)" },
  ];

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
      title: "Đa dạng chủng loại",
      description: "Từ máy cắt cỏ, máy cưa, máy khoan đến phụ kiện chính hãng",
    },
    {
      icon: <LocalOfferIcon sx={{ fontSize: 28 }} />,
      title: "Ưu đãi theo danh mục",
      description: "Giảm giá sâu cho từng nhóm sản phẩm riêng biệt",
    },
    {
      icon: <FlashOnIcon sx={{ fontSize: 28 }} />,
      title: "Cập nhật liên tục",
      description: "Sản phẩm mới nhất, công nghệ tiên tiến nhất",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        bgcolor: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background tint */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 180,
          background: "linear-gradient(180deg, #fef7e9 0%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Chip
              label="DANH MỤC NỔI BẬT"
              size="small"
              sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
            />

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ mb: 2, lineHeight: 1.2, fontSize: { xs: "1.8rem", md: "2.3rem" } }}
            >
              Khám phá{" "}
              <Box component="span" sx={{ color: "#f25c05" }}>
                {totalCategories}
              </Box>{" "}
              danh mục sản phẩm
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Từ các thương hiệu hàng đầu thế giới, đáp ứng mọi nhu cầu công việc của bạn
            </Typography>

            {/* Stats */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              {stats.map((stat, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{ p: 2, flex: 1, bgcolor: stat.bg, borderRadius: 3, textAlign: "center" }}
                >
                  <Avatar sx={{ bgcolor: stat.color, width: 36, height: 36, mx: "auto", mb: 1 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
            </Stack>

            <Button
              variant="contained"
              size="large"
              href="#products"
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                fontWeight: 700,
                px: 4,
                py: 1.4,
                borderRadius: 3,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#e64a19",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(242,92,5,0.3)",
                },
                transition: "all 0.28s ease",
              }}
            >
              Xem tất cả sản phẩm
              <ArrowForwardIcon sx={{ ml: 1, fontSize: 20 }} />
            </Button>
          </Grid>

          {/* Right — Feature cards */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              {features.map((feature, idx) => (
                <Grid size={{ xs: 12, sm: 4 }} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: "100%",
                      bgcolor: "#fef7e9",
                      borderRadius: 4,
                      border: "1px solid #ffb700",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 10px 22px rgba(255,183,0,0.18)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#fff",
                        width: 52,
                        height: 52,
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
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.8 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Category chips preview */}
            <Box
              sx={{
                mt: 3,
                p: 2.5,
                bgcolor: "#f5f5f5",
                borderRadius: 4,
                border: "1px dashed #ffb700",
              }}
            >
              <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 1.5 }}>
                Danh mục nổi bật:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {categories.slice(0, 6).map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    size="small"
                    onClick={() => cat.slug && router.push(`/product?category=${cat.slug}`)}
                    sx={{
                      bgcolor: "#fff",
                      border: "1px solid #ffb700",
                      fontSize: "0.72rem",
                      "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                    }}
                  />
                ))}
                {categories.length > 6 && (
                  <Chip
                    label={`+${categories.length - 6}`}
                    size="small"
                    sx={{ bgcolor: "#f25c05", color: "#fff", fontSize: "0.72rem" }}
                  />
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
