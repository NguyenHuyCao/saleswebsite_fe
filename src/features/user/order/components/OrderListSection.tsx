// order/components/OrderListSection.tsx
"use client";

import {
  Box,
  Typography,
  Chip,
  Stack,
  Skeleton,
  Tooltip,
  IconButton,
  Pagination,
  Alert,
  Button,
  Paper,
  Divider,
  Collapse,
  Card,
  CardContent,
  CardActions,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import ShippingStatusChip from "./ShippingStatusChip";
import { useMyOrdersQuery } from "../queries";
import { Dayjs } from "dayjs";

interface OrderListSectionProps {
  filterStatus?: string;
  searchTerm?: string;
  dateRange?: { start: Dayjs | null; end: Dayjs | null };
}

const ITEMS_PER_PAGE = 5;

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("vi-VN");

export default function OrderListSection({
  filterStatus = "all",
  searchTerm = "",
  dateRange = { start: null, end: null },
}: OrderListSectionProps) {
  const router = useRouter();
  const { data: orders = [], isLoading } = useMyOrdersQuery();
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    
    return orders.filter((order) => {
      if (filterStatus !== "all" && order.status !== filterStatus) return false;
      if (searchTerm && !order.orderId.toString().includes(searchTerm))
        return false;

      // SỬA PHẦN NÀY
      if (dateRange.start) {
        const orderDate = new Date(order.createdAt);
        const startDate = dateRange.start.toDate(); // Chuyển Dayjs -> Date
        if (orderDate < startDate) return false;
      }
      if (dateRange.end) {
        const orderDate = new Date(order.createdAt);
        const endDate = dateRange.end.toDate();
        endDate.setHours(23, 59, 59);
        if (orderDate > endDate) return false;
      }

      return true;
    });
  }, [orders, filterStatus, searchTerm, dateRange]);

  // Pagination
  const pageCount = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <Box mt={4}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rounded"
            height={120}
            sx={{ borderRadius: 3, mb: 2 }}
          />
        ))}
      </Box>
    );
  }

  if (!orders?.length) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          bgcolor: "#fafafa",
          borderRadius: 4,
          border: "2px dashed #ffb700",
          mt: 4,
        }}
      >
        <ShoppingBagIcon sx={{ fontSize: 60, color: "#ffb700", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Bạn chưa có đơn hàng nào
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Hãy khám phá các sản phẩm và đặt hàng ngay!
        </Typography>
        <Button
          variant="contained"
          href="/products"
          sx={{ bgcolor: "#f25c05" }}
        >
          Mua sắm ngay
        </Button>
      </Paper>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: 3, mt: 4 }}>
        Không tìm thấy đơn hàng phù hợp với bộ lọc.
      </Alert>
    );
  }

  return (
    <Box mt={4}>
      {/* Results count và pagination */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="body2" color="text.secondary">
          Hiển thị <strong>{paginatedOrders.length}</strong> /{" "}
          <strong>{filteredOrders.length}</strong> đơn hàng
        </Typography>
        {pageCount > 1 && (
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
            shape="rounded"
            color="primary"
            size="small"
          />
        )}
      </Stack>

      <AnimatePresence>
        {paginatedOrders.map((order: any) => (
          <motion.div
            key={order.orderId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <Card
              sx={{
                mb: 2,
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 8px 20px rgba(242,92,5,0.1)",
                  borderColor: "#ffb700",
                },
              }}
            >
              {/* Order Summary - Luôn hiển thị */}
              <CardContent
                sx={{
                  p: 2.5,
                  cursor: "pointer",
                  "&:last-child": { pb: 2.5 },
                }}
                onClick={() => toggleExpand(order.orderId)}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Left - Order Info */}
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        fontWeight={700}
                        color="#f25c05"
                        fontSize="1.1rem"
                      >
                        #{order.orderId}
                      </Typography>
                      <Tooltip title="Sao chép mã đơn">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyOrderId(order.orderId);
                          }}
                          sx={{ p: 0.5 }}
                        >
                          <ContentCopyIcon
                            sx={{ fontSize: 16, color: "#999" }}
                          />
                        </IconButton>
                      </Tooltip>
                      {copiedId === order.orderId && (
                        <Chip
                          label="Đã copy!"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.5rem",
                            bgcolor: "#4caf50",
                            color: "#fff",
                          }}
                        />
                      )}
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ mt: 0.5 }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 14, color: "#999" }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Middle - Total & Status */}
                  <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tổng tiền
                    </Typography>
                    <Typography
                      fontWeight={700}
                      color="#f25c05"
                      fontSize="1.1rem"
                    >
                      {order.totalAmount?.toLocaleString()}₫
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                    <ShippingStatusChip status={order.status} />
                  </Grid>

                  {/* Right - Actions */}
                  <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent={{ xs: "flex-start", md: "flex-end" }}
                    >
                      <Tooltip title="Theo dõi đơn hàng">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/order/tracking/${order.orderId}`);
                          }}
                          sx={{
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <LocalShippingIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Hỗ trợ">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push("/contact");
                          }}
                          sx={{
                            bgcolor: "#fff8e1",
                            color: "#f57c00",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <HelpOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Bảo hành">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push("/warranty#warranty-request");
                          }}
                          sx={{
                            bgcolor: "#e8f5e9",
                            color: "#2e7d32",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <BuildCircleIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Chi tiết">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(order.orderId);
                          }}
                          sx={{
                            bgcolor: "#f3e5f5",
                            color: "#7b1fa2",
                            width: 32,
                            height: 32,
                          }}
                        >
                          {expandedOrder === order.orderId ? (
                            <ExpandLessIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <ExpandMoreIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>

              {/* Expanded Details */}
              <Collapse in={expandedOrder === order.orderId}>
                <Divider />
                <CardContent sx={{ p: 3, bgcolor: "#fafafa" }}>
                  <Stack spacing={3}>
                    {/* Products List */}
                    <Box>
                      <Typography
                        fontWeight={600}
                        sx={{ mb: 2, color: "#333" }}
                      >
                        📦 Sản phẩm đã mua
                      </Typography>
                      <Stack spacing={2}>
                        {order.items?.map((item: any, i: any) => (
                          <Paper
                            key={i}
                            variant="outlined"
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "#fff",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  position: "relative",
                                  border: "1px solid #f0f0f0",
                                }}
                              >
                                <Image
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              </Box>

                              <Box sx={{ flex: 1 }}>
                                <Typography fontWeight={600} fontSize={14}>
                                  {item.productName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Số lượng: {item.quantity} x{" "}
                                  {item.unitPrice.toLocaleString()}₫
                                </Typography>
                                {item.promotions?.length > 0 && (
                                  <Chip
                                    label={`Khuyến mãi: ${item.promotions.map((p: any) => p.name).join(", ")}`}
                                    size="small"
                                    sx={{
                                      mt: 0.5,
                                      fontSize: "0.6rem",
                                      bgcolor: "#fff8e1",
                                    }}
                                  />
                                )}
                              </Box>

                              <Typography fontWeight={700} color="#f25c05">
                                {(
                                  item.quantity * item.unitPrice
                                ).toLocaleString()}
                                ₫
                              </Typography>

                              {order.status === "DELIVERED" && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<RateReviewIcon />}
                                  onClick={() =>
                                    router.push(
                                      `/review?product=${item.productName}`,
                                    )
                                  }
                                  sx={{
                                    borderColor: "#ffb700",
                                    color: "#f25c05",
                                    "&:hover": { bgcolor: "#fff8f0" },
                                  }}
                                >
                                  Đánh giá
                                </Button>
                              )}
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Order Information */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, borderRadius: 2 }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ mb: 1.5, color: "#f25c05" }}
                          >
                            🚚 Thông tin giao hàng
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            <strong>Địa chỉ:</strong>{" "}
                            {order.shippingAddress || "—"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Phương thức:</strong>{" "}
                            {order.paymentMethod || "—"}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, borderRadius: 2 }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ mb: 1.5, color: "#f25c05" }}
                          >
                            ⏱️ Thời gian
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            <strong>Đặt hàng:</strong>{" "}
                            {formatDateTime(order.createdAt)}
                          </Typography>
                          {order.status === "DELIVERED" &&
                            order.completedAt && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <strong>Hoàn thành:</strong>{" "}
                                {formatDateTime(order.completedAt)}
                              </Typography>
                            )}
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Order Summary */}
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "#fff8f0",
                        borderRadius: 2,
                        border: "1px solid #ffb700",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography fontWeight={600}>Tổng cộng</Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#f25c05"
                        >
                          {order.totalAmount?.toLocaleString()}₫
                        </Typography>
                      </Stack>
                    </Paper>
                  </Stack>
                </CardContent>
              </Collapse>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
