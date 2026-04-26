"use client";

import { Box, Paper, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useMyOrdersQuery } from "../queries";

export default function OrderStats() {
  const { data: orders = [] } = useMyOrdersQuery();

  const counts = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "PENDING" || o.status === "WAITING_PAYMENT").length,
    shipping:  orders.filter((o) => o.status === "CONFIRMED" || o.status === "SHIPPING").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED" || o.status === "FAILED").length,
  };

  const cards = [
    {
      icon: <ShoppingBagIcon   sx={{ fontSize: { xs: 22, sm: 26 } }} />,
      value: counts.total,
      label: "Tổng đơn hàng",
      color: "#f25c05",
      bg:    "rgba(242,92,5,0.08)",
      bd:    "rgba(242,92,5,0.2)",
    },
    {
      icon: <HourglassEmptyIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />,
      value: counts.pending,
      label: "Chờ xử lý",
      color: "#ff9800",
      bg:    "rgba(255,152,0,0.08)",
      bd:    "rgba(255,152,0,0.2)",
    },
    {
      icon: <LocalShippingIcon  sx={{ fontSize: { xs: 22, sm: 26 } }} />,
      value: counts.shipping,
      label: "Đang giao hàng",
      color: "#2196f3",
      bg:    "rgba(33,150,243,0.08)",
      bd:    "rgba(33,150,243,0.2)",
    },
    {
      icon: <CheckCircleIcon    sx={{ fontSize: { xs: 22, sm: 26 } }} />,
      value: counts.delivered,
      label: "Hoàn thành",
      color: "#4caf50",
      bg:    "rgba(76,175,80,0.08)",
      bd:    "rgba(76,175,80,0.2)",
    },
    {
      icon: <CancelIcon         sx={{ fontSize: { xs: 22, sm: 26 } }} />,
      value: counts.cancelled,
      label: "Đã hủy",
      color: "#f44336",
      bg:    "rgba(244,67,54,0.08)",
      bd:    "rgba(244,67,54,0.2)",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          sm: "repeat(3, 1fr)",
          md: "repeat(5, 1fr)",
        },
        gap: { xs: 1.5, sm: 2 },
        mb: 3,
      }}
    >
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.4, ease: "easeOut" }}
          style={{ height: "100%" }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.75, sm: 2.25 },
              borderRadius: 3,
              bgcolor: card.bg,
              border: "1px solid",
              borderColor: card.bd,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: `0 8px 24px ${card.color}22`,
                borderColor: card.color + "55",
              },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1.25, sm: 1.5 }}
              sx={{ mb: 0.75 }}
            >
              <Box
                sx={{
                  width:  { xs: 38, sm: 46 },
                  height: { xs: 38, sm: 46 },
                  borderRadius: 2,
                  bgcolor: card.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </Box>
              <Typography
                fontWeight={800}
                color={card.color}
                lineHeight={1}
                sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
              >
                {card.value}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              sx={{
                fontSize: { xs: "0.72rem", sm: "0.8rem" },
                lineHeight: 1.3,
                pl: 0.25,
              }}
            >
              {card.label}
            </Typography>
          </Paper>
        </motion.div>
      ))}
    </Box>
  );
}
