// order/components/OrderStats.tsx
"use client";

import { Box, Paper, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useMyOrdersQuery } from "../queries";

export default function OrderStats() {
  const { data: orders = [] } = useMyOrdersQuery();

  const stats = {
    total: orders.length,
    pending: orders.filter(
      (o) => o.status === "PENDING" || o.status === "WAITING_PAYMENT",
    ).length,
    shipping: orders.filter((o) => o.status === "SHIPPING").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter(
      (o) => o.status === "CANCELLED" || o.status === "FAILED",
    ).length,
  };

  const statCards = [
    {
      icon: <ShoppingBagIcon sx={{ fontSize: 28 }} />,
      value: stats.total,
      label: "Tổng đơn hàng",
      subLabel: null,
      color: "#f25c05",
      bgColor: "rgba(242,92,5,0.1)",
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 28 }} />,
      value: stats.pending + stats.shipping,
      label: "Đang xử lý",
      subLabel: `Chờ: ${stats.pending} | Vận chuyển: ${stats.shipping}`,
      color: "#2196f3",
      bgColor: "rgba(33,150,243,0.1)",
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 28 }} />,
      value: stats.delivered,
      label: "Hoàn thành",
      subLabel: null,
      color: "#4caf50",
      bgColor: "rgba(76,175,80,0.1)",
    },
    {
      icon: <CancelIcon sx={{ fontSize: 28 }} />,
      value: stats.cancelled,
      label: "Đã hủy",
      subLabel: null,
      color: "#f44336",
      bgColor: "rgba(244,67,54,0.1)",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statCards.map((stat, idx) => (
        <Grid key={idx} size={{ xs: 6, md: 3 }}>
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
                height: "100%", // QUAN TRỌNG: Cố định chiều cao
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 28px ${stat.color}20`,
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ height: "100%" }}
              >
                {/* Icon - Cố định kích thước */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: stat.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0, // Không co lại
                  }}
                >
                  {stat.icon}
                </Box>

                {/* Content - Flex để căn chỉnh */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: 70, // Chiều cao tối thiểu
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={stat.color}
                    lineHeight={1.2}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" fontWeight={500} lineHeight={1.3}>
                    {stat.label}
                  </Typography>

                  {/* SubLabel - Luôn có chiều cao cố định dù có hay không */}
                  <Box sx={{ height: 20, mt: 0.5 }}>
                    {stat.subLabel && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: "0.7rem",
                        }}
                      >
                        {stat.subLabel}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
