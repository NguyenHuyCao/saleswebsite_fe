// order/components/OrderHistoryHeroSection.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Chip,
  Stack,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useMyOrdersQuery } from "../queries";

export default function OrderHistoryHeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: orders = [] } = useMyOrdersQuery();

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 4, md: 5 },
        px: { xs: 2, md: 4 },
        borderRadius: 3,
        bgcolor: "#fafafa",
        border: "1px solid #f0f0f0",
        mb: 3,
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* Left Content - 7 phần */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Top Badge */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Chip
              icon={<ReceiptIcon sx={{ fontSize: 16 }} />}
              label={`${totalOrders} đơn hàng`}
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                fontWeight: 600,
                height: 28,
              }}
            />

            <Avatar
              sx={{
                bgcolor: "#ffb700",
                width: 32,
                height: 32,
                display: { md: "none" }, // Chỉ hiện trên mobile
              }}
            >
              <LocalShippingIcon sx={{ fontSize: 18, color: "#000" }} />
            </Avatar>
          </Stack>

          {/* Title */}
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ mb: 2, color: "#333" }}
          >
            Lịch sử đơn hàng
          </Typography>

          {/* Stats Row */}
          <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#f25c05">
                {totalOrders}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tổng đơn
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#f25c05">
                {totalSpent.toLocaleString()}₫
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tổng chi tiêu
              </Typography>
            </Box>
          </Stack>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.5 }}
          >
            Theo dõi trạng thái đơn hàng và lịch sử mua sắm của bạn.
          </Typography>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              size="small"
              href="/product"
              startIcon={<ShoppingBagIcon />}
              sx={{
                bgcolor: "#ffb700",
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              Mua sắm tiếp
            </Button>

            <Button
              variant="outlined"
              size="small"
              href="#order-list"
              startIcon={<TimelineIcon />}
              sx={{
                borderColor: "#ffb700",
                color: "#f25c05",
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              Xem đơn hàng
            </Button>
          </Stack>

          {/* Footer */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ opacity: 0.6 }}
          >
            <LocalShippingIcon sx={{ fontSize: 16, color: "#999" }} />
            <Typography variant="caption" color="text.secondary">
              Giao hàng toàn quốc
            </Typography>
          </Stack>
        </Grid>

        {/* Right Content - 5 phần */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="/images/banner/istockphoto-1639694829-612x612.jpg"
                alt="Delivery"
                width={180}
                height={180}
                style={{ objectFit: "contain" }}
              />
            </motion.div>

            {/* Quick Stats */}
            <Stack direction="row" spacing={2}>
              <Paper
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  bgcolor: "#fff",
                  borderRadius: 2,
                  minWidth: 80,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Giao hàng
                </Typography>
                <Typography variant="body2" fontWeight={700} color="#f25c05">
                  Nhanh
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  bgcolor: "#fff",
                  borderRadius: 2,
                  minWidth: 80,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Bảo hành
                </Typography>
                <Typography variant="body2" fontWeight={700} color="#f25c05">
                  12 tháng
                </Typography>
              </Paper>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
