// wishlist/components/WishlistStats.tsx
"use client";

import { Box, Paper, Typography, Stack, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useWishlist } from "../queries";

export default function WishlistStats() {
  const { data: items = [] } = useWishlist();

  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const discountItems = items.filter((item) => item.sale).length;
  const averagePrice = items.length > 0 ? totalValue / items.length : 0;

  const stats = [
    {
      icon: <FavoriteIcon sx={{ fontSize: 28 }} />,
      value: items.length,
      label: "Sản phẩm",
      subLabel: "đang theo dõi",
      color: "#f25c05",
      bgColor: "rgba(242,92,5,0.1)",
      trend: "+12%",
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
      value: totalValue.toLocaleString() + "₫",
      label: "Tổng giá trị",
      subLabel: "ước tính",
      color: "#4caf50",
      bgColor: "rgba(76,175,80,0.1)",
      trend: null,
    },
    {
      icon: <LocalOfferIcon sx={{ fontSize: 28 }} />,
      value: discountItems,
      label: "Đang giảm giá",
      subLabel: `chiếm ${items.length ? Math.round((discountItems / items.length) * 100) : 0}%`,
      color: "#2196f3",
      bgColor: "rgba(33,150,243,0.1)",
      trend: "+3",
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 28 }} />,
      value: items.length,
      label: "Có thể mua",
      subLabel: "còn hàng",
      color: "#9c27b0",
      bgColor: "rgba(156,39,176,0.1)",
      trend: null,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: stat.bgColor,
                border: "1px solid",
                borderColor: stat.color + "40",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 28px ${stat.color}20`,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: stat.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={stat.color}
                    >
                      {stat.value}
                    </Typography>
                    {stat.trend && (
                      <Chip
                        icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                        label={stat.trend}
                        size="small"
                        sx={{
                          bgcolor: "#4caf50",
                          color: "#fff",
                          height: 20,
                          fontSize: "0.6rem",
                        }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" fontWeight={500}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.subLabel}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
