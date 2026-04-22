"use client";

import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useMyOrdersQuery } from "../queries";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function OrderHistoryHeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: orders = [] } = useMyOrdersQuery();

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter(
    (o) =>
      o.status === "PENDING" ||
      o.status === "WAITING_PAYMENT" ||
      o.status === "CONFIRMED" ||
      o.status === "SHIPPING",
  ).length;

  const spentDisplay =
    totalSpent >= 1_000_000
      ? `${(totalSpent / 1_000_000).toFixed(1)}tr₫`
      : `${totalSpent.toLocaleString("vi-VN")}₫`;

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 3.5, md: 4.5 },
        px: { xs: 2.5, md: 4 },
        borderRadius: 4,
        background:
          "linear-gradient(135deg, #fff8f3 0%, #fff3e0 65%, #fce4ec15 100%)",
        border: "1px solid #ffe0b255",
        mb: 3,
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: "#f25c050c",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -24,
          left: { xs: -24, md: "35%" },
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "#ffb70012",
          pointerEvents: "none",
        }}
      />

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        gap={{ xs: 3, md: 4 }}
      >
        {/* ── Left: text content ────────────────────────────── */}
        <Box flex={1} position="relative" zIndex={1}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <Chip
                icon={
                  <ReceiptLongIcon
                    sx={{ fontSize: 15, color: "#fff !important" }}
                  />
                }
                label="Lịch sử đơn hàng của bạn"
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.74rem",
                  height: 28,
                  mb: 1.5,
                }}
              />
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={800}
                color="#1a1a1a"
                lineHeight={1.2}
                sx={{ mb: 0.75 }}
              >
                Quản lý đơn hàng
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2.5, maxWidth: 440, lineHeight: 1.65 }}
              >
                Theo dõi trạng thái giao hàng, kiểm tra lịch sử thanh toán và
                quản lý tất cả đơn hàng tại một nơi.
              </Typography>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={itemVariants}>
              <Stack
                direction="row"
                divider={
                  <Box
                    sx={{ width: 1, bgcolor: "#e0e0e0", alignSelf: "stretch" }}
                  />
                }
                spacing={{ xs: 2.5, sm: 3.5 }}
                sx={{ mb: 2.5 }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#f25c05"
                    lineHeight={1}
                    sx={{ fontSize: { xs: "1.6rem", sm: "2rem" } }}
                  >
                    {totalOrders}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Tổng đơn
                  </Typography>
                </Box>

                <Box sx={{ pl: { xs: 2.5, sm: 3.5 } }}>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#f25c05"
                    lineHeight={1}
                    sx={{ fontSize: { xs: "1.4rem", sm: "1.75rem" } }}
                  >
                    {spentDisplay}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Tổng chi tiêu
                  </Typography>
                </Box>

                {activeOrders > 0 && (
                  <Box sx={{ pl: { xs: 2.5, sm: 3.5 } }}>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="#2196f3"
                      lineHeight={1}
                      sx={{ fontSize: { xs: "1.6rem", sm: "2rem" } }}
                    >
                      {activeOrders}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Đang xử lý
                    </Typography>
                  </Box>
                )}
              </Stack>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={itemVariants}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                useFlexGap
              >
                <Button
                  variant="contained"
                  href="/product"
                  startIcon={<ShoppingBagIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: "#f25c05",
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2.5,
                    px: 3,
                    py: 1,
                    fontSize: "0.875rem",
                    boxShadow: "0 4px 14px rgba(242,92,5,0.28)",
                    "&:hover": {
                      bgcolor: "#d94f00",
                      boxShadow: "0 6px 18px rgba(242,92,5,0.35)",
                    },
                  }}
                >
                  Mua sắm tiếp
                </Button>
                <Button
                  variant="outlined"
                  href="#order-list"
                  startIcon={<LocalShippingIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    borderColor: "#f25c05",
                    color: "#f25c05",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2.5,
                    px: 3,
                    py: 1,
                    fontSize: "0.875rem",
                    "&:hover": {
                      borderColor: "#d94f00",
                      bgcolor: "#fff8f3",
                    },
                  }}
                >
                  Xem đơn hàng
                </Button>
              </Stack>
            </motion.div>
          </motion.div>
        </Box>

        {/* ── Right: animated illustration (desktop only) ───── */}
        {!isMobile && (
          <Box
            sx={{
              width: { md: 200, lg: 240 },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "backOut" }}
            >
              <Box
                sx={{
                  width: 116,
                  height: 116,
                  borderRadius: "50%",
                  bgcolor: "#fff",
                  border: "3px solid #f25c0525",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(242,92,5,0.12)",
                }}
              >
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  <LocalShippingIcon sx={{ fontSize: 52, color: "#f25c05" }} />
                </motion.div>
              </Box>
            </motion.div>

            <Stack direction="row" spacing={1.5}>
              {[
                { label: "Giao hàng", value: "Toàn quốc" },
                { label: "Bảo hành", value: "12 tháng" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.35 }}
                >
                  <Box
                    sx={{
                      p: 1.25,
                      textAlign: "center",
                      bgcolor: "#fff",
                      borderRadius: 2,
                      border: "1px solid #f0f0f0",
                      minWidth: 84,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="#f25c05"
                      sx={{ fontSize: "0.78rem" }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
