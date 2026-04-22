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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  useMediaQuery,
  useTheme,
  LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import ShippingStatusChip from "./ShippingStatusChip";
import { useMyOrdersQuery, useCancelOrderMutation } from "../queries";
import { http } from "@/lib/api/http";
import { mutate } from "swr";
import { CART_COUNT_KEY } from "@/constants/apiKeys";
import type { Dayjs } from "dayjs";
import type { Order } from "../types";

interface OrderListSectionProps {
  filterStatus?: string;
  searchTerm?: string;
  dateRange?: { start: Dayjs | null; end: Dayjs | null };
}

const ITEMS_PER_PAGE = 5;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

// Image URL helper — handles both absolute and relative paths
const getImg = (src: string | null): string | null => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${BACKEND_URL}/api/v1/files/${src}`;
};

const formatDate = (s: string) => new Date(s).toLocaleDateString("vi-VN");
const formatDateTime = (s: string) => new Date(s).toLocaleString("vi-VN");

const PAYMENT_STATUS_INFO: Record<string, { label: string; color: string }> = {
  PAID:           { label: "Đã thanh toán", color: "#4caf50" },
  PENDING:        { label: "Chờ thanh toán", color: "#ff9800" },
  REFUND_PENDING: { label: "Chờ hoàn tiền",  color: "#9c27b0" },
  CANCELLED:      { label: "Đã hủy",         color: "#f44336" },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  COD:   "Thanh toán khi nhận hàng (COD)",
  MOMO:  "Ví MoMo",
  VNPAY: "VNPay / Chuyển khoản",
};

const CANCEL_REASONS = [
  "Tôi muốn thay đổi địa chỉ giao hàng",
  "Tôi muốn thay đổi sản phẩm / số lượng",
  "Tôi tìm được giá tốt hơn ở nơi khác",
  "Thời gian giao hàng quá lâu",
  "Tôi đặt nhầm sản phẩm",
  "Khác",
];

function PaymentBadge({ status }: { status?: string }) {
  const info = PAYMENT_STATUS_INFO[status ?? ""] ?? { label: "Chưa rõ", color: "#9e9e9e" };
  return (
    <Chip
      label={info.label}
      size="small"
      sx={{
        bgcolor: `${info.color}1A`,
        color: info.color,
        border: `1px solid ${info.color}55`,
        fontWeight: 600,
        fontSize: "0.63rem",
        height: 20,
      }}
    />
  );
}

// Skeleton while loading
function OrderSkeleton() {
  return (
    <Box mt={4}>
      {[1, 2, 3].map((i) => (
        <Card key={i} sx={{ mb: 2, borderRadius: 3, overflow: "hidden" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="text" width={160} height={24} />
                <Skeleton variant="text" width={100} height={18} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <Skeleton variant="text" width={80} height={18} />
                <Skeleton variant="text" width={110} height={28} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <Skeleton variant="rounded" width={110} height={24} sx={{ borderRadius: 3 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Stack direction="row" spacing={1} justifyContent={{ md: "flex-end" }}>
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} variant="circular" width={32} height={32} />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default function OrderListSection({
  filterStatus = "all",
  searchTerm = "",
  dateRange = { start: null, end: null },
}: OrderListSectionProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: orders = [], isLoading } = useMyOrdersQuery();
  const cancelMutation = useCancelOrderMutation();

  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // Cancel dialog
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    orderId: number | string | null;
    orderCode: string;
    totalAmount: number;
    isPaid: boolean;
  }>({ open: false, orderId: null, orderCode: "", totalAmount: 0, isPaid: false });
  const [cancelReason, setCancelReason] = useState("");
  const [cancelCustomText, setCancelCustomText] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });

  const showToast = (message: string, severity: "success" | "error" | "info" = "success") =>
    setToast({ open: true, message, severity });

  // ── Reset page when filters change ─────────────────────────
  useEffect(() => { setPage(1); }, [filterStatus, searchTerm, dateRange]);

  // ── Filtered orders ─────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filterStatus !== "all" && order.status !== filterStatus) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (
          !order.orderCode?.toLowerCase().includes(q) &&
          !order.orderId.toString().includes(q)
        )
          return false;
      }
      if (dateRange.start) {
        if (new Date(order.createdAt) < dateRange.start.toDate()) return false;
      }
      if (dateRange.end) {
        const end = dateRange.end.toDate();
        end.setHours(23, 59, 59, 999);
        if (new Date(order.createdAt) > end) return false;
      }
      return true;
    });
  }, [orders, filterStatus, searchTerm, dateRange]);

  // ── Pagination ─────────────────────────────────────────────
  const pageCount = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  // ── Helpers ────────────────────────────────────────────────
  const canCancel = (status: string) =>
    status === "PENDING" || status === "WAITING_PAYMENT" || status === "CONFIRMED";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) =>
    setExpandedOrder((prev) => (prev === id ? null : id));

  // ── Cancel order ───────────────────────────────────────────
  const openCancelDialog = (order: Order, isPaid: boolean) => {
    setCancelError(null);
    setCancelReason("");
    setCancelCustomText("");
    setCancelDialog({
      open: true,
      orderId: order.orderId,
      orderCode: order.orderCode || `#${order.orderId}`,
      totalAmount: order.totalAmount,
      isPaid,
    });
  };

  const closeCancelDialog = () =>
    setCancelDialog({ open: false, orderId: null, orderCode: "", totalAmount: 0, isPaid: false });

  const handleConfirmCancel = async () => {
    if (!cancelDialog.orderId) return;
    const reason =
      cancelReason === "Khác" ? cancelCustomText.trim() : cancelReason;
    try {
      await cancelMutation.mutateAsync({
        orderId: cancelDialog.orderId,
        reason: reason || undefined,
      });
      closeCancelDialog();
      showToast("Đơn hàng đã được hủy thành công.");
    } catch (e: any) {
      setCancelError(e?.message || "Không thể hủy đơn. Vui lòng thử lại.");
    }
  };

  // ── Reorder (add all items back to cart) ───────────────────
  const handleReorder = async (order: Order) => {
    const id = String(order.orderId);
    setReorderingId(id);
    try {
      await Promise.all(
        order.items.map((item) =>
          http.post("/api/v1/carts", {
            productId: item.productId,
            quantity: item.quantity,
          })
        )
      );
      mutate(CART_COUNT_KEY, undefined, { revalidate: true });
      showToast("Đã thêm sản phẩm vào giỏ hàng!", "success");
      router.push("/cart");
    } catch {
      showToast("Không thể đặt lại đơn. Vui lòng thử lại.", "error");
    } finally {
      setReorderingId(null);
    }
  };

  // ── Loading ────────────────────────────────────────────────
  if (isLoading) return <OrderSkeleton />;

  // ── Empty state ────────────────────────────────────────────
  if (!orders.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: { xs: 4, sm: 6 },
            textAlign: "center",
            bgcolor: "#fafafa",
            borderRadius: 4,
            border: "2px dashed #ffb700",
            mt: 4,
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 64, color: "#ffb700", mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Bạn chưa có đơn hàng nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy khám phá hàng ngàn sản phẩm máy công cụ chính hãng và đặt hàng ngay!
          </Typography>
          <Button
            variant="contained"
            href="/product"
            startIcon={<ShoppingBagIcon />}
            sx={{
              bgcolor: "#f25c05",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              "&:hover": { bgcolor: "#d94f00" },
            }}
          >
            Mua sắm ngay
          </Button>
        </Paper>
      </motion.div>
    );
  }

  // ── No results from filters ────────────────────────────────
  if (!filteredOrders.length) {
    return (
      <Alert
        severity="info"
        sx={{ borderRadius: 3, mt: 4 }}
        action={
          <Button
            color="inherit"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={() => {
              /* parent handles clear via filter props */
            }}
          >
            Xem tất cả
          </Button>
        }
      >
        Không tìm thấy đơn hàng phù hợp với bộ lọc hiện tại.
      </Alert>
    );
  }

  return (
    <Box mt={3} id="order-list">
      {/* ── Header row ─────────────────────────────────────────── */}
      <Box sx={{ mb: 2, px: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị{" "}
          <strong>{Math.min(page * ITEMS_PER_PAGE, filteredOrders.length)}</strong> /{" "}
          <strong>{filteredOrders.length}</strong> đơn hàng
        </Typography>
      </Box>

      {/* ── Order cards ────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {paginatedOrders.map((order: Order) => {
          const codeDisplay = order.orderCode || `#${order.orderId}`;
          const isPaid = order.paymentStatus === "PAID";
          const isExpanded = expandedOrder === String(order.orderId);
          const isWaitingPayment =
            order.status === "WAITING_PAYMENT" && order.paymentMethod !== "COD";
          const isDelivered = order.status === "DELIVERED";
          const isShipping = order.status === "SHIPPING";

          return (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              layout
            >
              <Card
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: isWaitingPayment
                    ? "#ff980040"
                    : isExpanded
                    ? "#f25c0540"
                    : "#f0f0f0",
                  transition: "all 0.25s",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(242,92,5,0.1)",
                    borderColor: "#ffb70060",
                  },
                }}
              >
                {/* ── WAITING_PAYMENT progress indicator ────────── */}
                {isWaitingPayment && (
                  <LinearProgress
                    color="warning"
                    sx={{ height: 3, "& .MuiLinearProgress-bar": { bgcolor: "#ff9800" } }}
                  />
                )}

                {/* ── Card header — always visible ───────────────── */}
                <CardContent
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    cursor: "pointer",
                    "&:last-child": { pb: { xs: 2, sm: 2.5 } },
                  }}
                  onClick={() => toggleExpand(String(order.orderId))}
                >
                  <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">

                    {/* Left — code + date */}
                    <Grid size={{ xs: 12, sm: 5, md: 4 }}>
                      <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                        <Typography
                          fontWeight={700}
                          color="#f25c05"
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        >
                          {codeDisplay}
                        </Typography>
                        <Tooltip title={copiedId === codeDisplay ? "Đã sao chép!" : "Sao chép mã đơn"}>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleCopy(codeDisplay); }}
                            sx={{ p: 0.4 }}
                          >
                            <ContentCopyIcon
                              sx={{
                                fontSize: 14,
                                color: copiedId === codeDisplay ? "#4caf50" : "#bbb",
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        {copiedId === codeDisplay && (
                          <Chip
                            label="✓ Đã copy"
                            size="small"
                            sx={{ height: 18, fontSize: "0.58rem", bgcolor: "#4caf50", color: "#fff" }}
                          />
                        )}
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5} mt={0.25}>
                        <AccessTimeIcon sx={{ fontSize: 13, color: "#bbb" }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(order.createdAt)}
                        </Typography>
                        {order.items?.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            · {order.items.length} sản phẩm
                          </Typography>
                        )}
                      </Stack>
                    </Grid>

                    {/* Middle — total + status */}
                    <Grid size={{ xs: 6, sm: 4, md: 4 }}>
                      <Typography variant="caption" color="text.secondary">
                        Tổng tiền
                      </Typography>
                      <Typography
                        fontWeight={700}
                        color="#f25c05"
                        sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                      >
                        {order.totalAmount?.toLocaleString("vi-VN")}₫
                      </Typography>
                      <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap">
                        <ShippingStatusChip status={order.status} />
                        {order.paymentStatus && order.paymentStatus !== "PENDING" && (
                          <PaymentBadge status={order.paymentStatus} />
                        )}
                      </Stack>
                    </Grid>

                    {/* Right — action buttons */}
                    <Grid size={{ xs: 6, sm: 3, md: 4 }}>
                      <Stack
                        direction="row"
                        spacing={0.75}
                        justifyContent={{ xs: "flex-end", sm: "flex-end" }}
                        flexWrap="wrap"
                        gap={0.75}
                      >
                        {/* WAITING_PAYMENT → prominent pay button */}
                        {isWaitingPayment && (
                          <Tooltip title="Thanh toán ngay">
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<PaymentIcon sx={{ fontSize: 14 }} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/payment/${order.orderId}?method=${order.paymentMethod}`);
                              }}
                              sx={{
                                bgcolor: "#ff9800",
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                borderRadius: 2,
                                py: 0.5,
                                px: 1.25,
                                "&:hover": { bgcolor: "#f57c00" },
                                whiteSpace: "nowrap",
                              }}
                            >
                              {isMobile ? "Thanh toán" : "Thanh toán ngay"}
                            </Button>
                          </Tooltip>
                        )}

                        {/* DELIVERED → reorder */}
                        {isDelivered && (
                          <Tooltip title="Đặt lại đơn này">
                            <IconButton
                              size="small"
                              disabled={reorderingId === String(order.orderId)}
                              onClick={(e) => { e.stopPropagation(); handleReorder(order); }}
                              sx={{
                                bgcolor: "#e8f5e9",
                                color: "#2e7d32",
                                width: 32,
                                height: 32,
                                "&:hover": { bgcolor: "#c8e6c9" },
                              }}
                            >
                              <ReplayIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Tracking */}
                        {!isWaitingPayment && (
                          <Tooltip title="Theo dõi đơn hàng">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/order/tracking/${order.orderId}`);
                              }}
                              sx={{ bgcolor: "#e3f2fd", color: "#1976d2", width: 32, height: 32 }}
                            >
                              <LocalShippingIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Support */}
                        <Tooltip title="Liên hệ hỗ trợ">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); router.push("/contact"); }}
                            sx={{ bgcolor: "#fff8e1", color: "#f57c00", width: 32, height: 32 }}
                          >
                            <HelpOutlineIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>

                        {/* Warranty */}
                        <Tooltip title="Yêu cầu bảo hành">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); router.push("/warranty"); }}
                            sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", width: 32, height: 32 }}
                          >
                            <BuildCircleIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>

                        {/* Cancel */}
                        {canCancel(order.status) && (
                          <Tooltip title="Hủy đơn hàng">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                openCancelDialog(order, isPaid);
                              }}
                              sx={{ bgcolor: "#fce4ec", color: "#c62828", width: 32, height: 32 }}
                            >
                              <CancelIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Expand/collapse */}
                        <Tooltip title={isExpanded ? "Thu gọn" : "Xem chi tiết"}>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); toggleExpand(String(order.orderId)); }}
                            sx={{
                              bgcolor: isExpanded ? "#f3e5f5" : "#f5f5f5",
                              color: isExpanded ? "#7b1fa2" : "#666",
                              width: 32,
                              height: 32,
                            }}
                          >
                            {isExpanded
                              ? <ExpandLessIcon sx={{ fontSize: 17 }} />
                              : <ExpandMoreIcon sx={{ fontSize: 17 }} />
                            }
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>

                {/* ── Expanded details ───────────────────────────── */}
                <Collapse in={isExpanded} unmountOnExit>
                  <Divider />
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#fafafa" }}>
                    <Stack spacing={3}>

                      {/* Products */}
                      <Box>
                        <Typography
                          fontWeight={700}
                          sx={{ mb: 1.5, color: "#333", display: "flex", alignItems: "center", gap: 0.75 }}
                        >
                          <ShoppingBagIcon sx={{ fontSize: 18, color: "#f25c05" }} />
                          Sản phẩm đã mua
                        </Typography>
                        <Stack spacing={1.5}>
                          {order.items?.map((item, i) => {
                            const imgSrc = getImg(item.imageUrl);
                            const lineTotal = item.quantity * item.unitPrice;
                            return (
                              <Paper
                                key={i}
                                variant="outlined"
                                sx={{
                                  p: { xs: 1.5, sm: 2 },
                                  borderRadius: 2,
                                  bgcolor: "#fff",
                                  transition: "box-shadow 0.2s",
                                  "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
                                }}
                              >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  {/* Thumbnail */}
                                  <Box
                                    sx={{
                                      width: { xs: 52, sm: 64 },
                                      height: { xs: 52, sm: 64 },
                                      borderRadius: 2,
                                      overflow: "hidden",
                                      position: "relative",
                                      border: "1px solid #f0f0f0",
                                      flexShrink: 0,
                                      bgcolor: "#f5f5f5",
                                    }}
                                  >
                                    {imgSrc ? (
                                      <Image
                                        src={imgSrc}
                                        alt={item.productName}
                                        fill
                                        unoptimized
                                        style={{ objectFit: "cover" }}
                                      />
                                    ) : (
                                      <Avatar
                                        variant="square"
                                        sx={{ width: "100%", height: "100%", bgcolor: "#f5f5f5" }}
                                      >
                                        📦
                                      </Avatar>
                                    )}
                                  </Box>

                                  {/* Info */}
                                  <Box flex={1} minWidth={0}>
                                    <Typography
                                      fontWeight={600}
                                      sx={{
                                        fontSize: { xs: "0.82rem", sm: "0.9rem" },
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                      }}
                                    >
                                      {item.productName}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      {item.quantity} × {item.unitPrice.toLocaleString("vi-VN")}₫
                                    </Typography>
                                    {item.promotions && item.promotions.length > 0 && (
                                      <Chip
                                        label={`KM: ${item.promotions.map((p) => p.promotionName).join(", ")}`}
                                        size="small"
                                        sx={{
                                          mt: 0.5,
                                          fontSize: "0.6rem",
                                          height: 18,
                                          bgcolor: "#fff8e1",
                                          color: "#f57c00",
                                          border: "1px solid #ffcc0260",
                                        }}
                                      />
                                    )}
                                  </Box>

                                  {/* Line total + action */}
                                  <Stack alignItems="flex-end" spacing={0.5} flexShrink={0}>
                                    <Typography
                                      fontWeight={700}
                                      color="#f25c05"
                                      sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                                    >
                                      {lineTotal.toLocaleString("vi-VN")}₫
                                    </Typography>
                                    {isDelivered && (
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<RateReviewIcon sx={{ fontSize: 13 }} />}
                                        onClick={() =>
                                          router.push(
                                            `/product?search=${encodeURIComponent(item.productName)}`
                                          )
                                        }
                                        sx={{
                                          textTransform: "none",
                                          borderColor: "#ffb700",
                                          color: "#f25c05",
                                          fontSize: { xs: "0.62rem", sm: "0.7rem" },
                                          py: 0.25,
                                          px: 1,
                                          borderRadius: 1.5,
                                          "&:hover": { bgcolor: "#fff8f0" },
                                        }}
                                      >
                                        Đánh giá
                                      </Button>
                                    )}
                                  </Stack>
                                </Stack>
                              </Paper>
                            );
                          })}
                        </Stack>
                      </Box>

                      <Divider />

                      {/* Info grid — shipping / payment / timeline */}
                      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                        {/* Shipping info */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2, height: "100%", bgcolor: "#fff" }}
                          >
                            <Stack direction="row" alignItems="center" spacing={0.75} mb={1.25}>
                              <LocalShippingIcon sx={{ fontSize: 16, color: "#f25c05" }} />
                              <Typography variant="subtitle2" fontWeight={700} color="#f25c05">
                                Giao hàng
                              </Typography>
                            </Stack>
                            <Stack spacing={0.75}>
                              <Typography variant="body2" color="text.secondary" component="div">
                                <strong>Địa chỉ:</strong>{" "}
                                {order.shippingAddress || "—"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" component="div">
                                <strong>Phương thức:</strong>{" "}
                                {order.shippingMethod === "EXPRESS"
                                  ? "Giao nhanh"
                                  : order.shippingMethod === "STANDARD"
                                  ? "Giao tiêu chuẩn"
                                  : order.shippingMethod || "—"}
                              </Typography>
                            </Stack>
                          </Paper>
                        </Grid>

                        {/* Payment info */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2, height: "100%", bgcolor: "#fff" }}
                          >
                            <Stack direction="row" alignItems="center" spacing={0.75} mb={1.25}>
                              <PaymentIcon sx={{ fontSize: 16, color: "#f25c05" }} />
                              <Typography variant="subtitle2" fontWeight={700} color="#f25c05">
                                Thanh toán
                              </Typography>
                            </Stack>
                            <Stack spacing={0.75}>
                              <Typography variant="body2" color="text.secondary" component="div">
                                <strong>Phương thức:</strong>{" "}
                                {PAYMENT_METHOD_LABEL[order.paymentMethod ?? ""] ??
                                  order.paymentMethod ??
                                  "—"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" component="div">
                                <strong>Trạng thái:</strong>{" "}
                                <PaymentBadge status={order.paymentStatus} />
                              </Typography>
                              {order.paidAmount != null && order.paidAmount > 0 && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                  <strong>Đã thanh toán:</strong>{" "}
                                  <span style={{ color: "#4caf50", fontWeight: 700 }}>
                                    {order.paidAmount.toLocaleString("vi-VN")}₫
                                  </span>
                                </Typography>
                              )}
                              {order.paidAt && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                  <strong>Thời gian TT:</strong> {formatDateTime(order.paidAt)}
                                </Typography>
                              )}
                              {order.transferContent && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                  <strong>Nội dung CK:</strong>{" "}
                                  <Box
                                    component="span"
                                    sx={{ fontFamily: "monospace", color: "#f25c05", fontWeight: 600 }}
                                  >
                                    {order.transferContent}
                                  </Box>
                                </Typography>
                              )}
                              {isWaitingPayment && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  fullWidth
                                  startIcon={<PaymentIcon sx={{ fontSize: 14 }} />}
                                  onClick={() =>
                                    router.push(
                                      `/payment/${order.orderId}?method=${order.paymentMethod}`
                                    )
                                  }
                                  sx={{
                                    mt: 1,
                                    bgcolor: "#ff9800",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: "0.78rem",
                                    borderRadius: 2,
                                    "&:hover": { bgcolor: "#f57c00" },
                                  }}
                                >
                                  Thanh toán ngay
                                </Button>
                              )}
                            </Stack>
                          </Paper>
                        </Grid>

                        {/* Timeline */}
                        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2, height: "100%", bgcolor: "#fff" }}
                          >
                            <Stack direction="row" alignItems="center" spacing={0.75} mb={1.25}>
                              <AccessTimeIcon sx={{ fontSize: 16, color: "#f25c05" }} />
                              <Typography variant="subtitle2" fontWeight={700} color="#f25c05">
                                Thời gian
                              </Typography>
                            </Stack>
                            <Stack spacing={1}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Box
                                  sx={{
                                    width: 8, height: 8, borderRadius: "50%",
                                    bgcolor: "#f25c05", flexShrink: 0,
                                  }}
                                />
                                <Box>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Đặt hàng
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDateTime(order.createdAt)}
                                  </Typography>
                                </Box>
                              </Stack>
                              {order.paidAt && (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Box
                                    sx={{
                                      width: 8, height: 8, borderRadius: "50%",
                                      bgcolor: "#4caf50", flexShrink: 0,
                                    }}
                                  />
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      Thanh toán
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                      {formatDateTime(order.paidAt)}
                                    </Typography>
                                  </Box>
                                </Stack>
                              )}
                              {isDelivered && order.deliveredAt && (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <CheckCircleIcon sx={{ fontSize: 10, color: "#4caf50" }} />
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      Đã nhận hàng
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                      {formatDateTime(order.deliveredAt)}
                                    </Typography>
                                  </Box>
                                </Stack>
                              )}
                            </Stack>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Order total summary */}
                      <Paper
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          bgcolor: "#fff8f0",
                          borderRadius: 2,
                          border: "1px solid #ffb70060",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={600} color="text.secondary">
                            Tổng cộng ({order.items?.length ?? 0} sản phẩm)
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#f25c05"
                            sx={{ fontSize: { xs: "1.05rem", sm: "1.25rem" } }}
                          >
                            {order.totalAmount?.toLocaleString("vi-VN")}₫
                          </Typography>
                        </Stack>
                        {isPaid && order.paymentStatus === "REFUND_PENDING" && (
                          <Alert severity="info" sx={{ mt: 1, py: 0.5, borderRadius: 1.5 }}>
                            Hoàn tiền đang được xử lý trong 3–5 ngày làm việc.
                          </Alert>
                        )}
                      </Paper>

                      {/* Action buttons in expanded */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {isDelivered && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ReplayIcon />}
                            disabled={reorderingId === String(order.orderId)}
                            onClick={() => handleReorder(order)}
                            sx={{
                              bgcolor: "#f25c05",
                              textTransform: "none",
                              fontWeight: 600,
                              borderRadius: 2,
                              "&:hover": { bgcolor: "#d94f00" },
                            }}
                          >
                            {reorderingId === String(order.orderId)
                              ? "Đang xử lý..."
                              : "Đặt lại đơn này"}
                          </Button>
                        )}
                        {canCancel(order.status) && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => openCancelDialog(order, isPaid)}
                            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                          >
                            Hủy đơn hàng
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ── Bottom pagination ────────────────────────────────────── */}
      {pageCount > 1 && (
        <Stack alignItems="center" mt={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#f25c05",
                color: "#fff",
              },
            }}
          />
        </Stack>
      )}

      {/* ── Cancel dialog ─────────────────────────────────────────── */}
      <Dialog
        open={cancelDialog.open}
        onClose={closeCancelDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            color: "#c62828",
            fontWeight: 700,
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CancelIcon sx={{ color: "#c62828" }} />
          Hủy đơn hàng?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: "0.9rem" }}>
            Đơn{" "}
            <strong style={{ color: "#333" }}>{cancelDialog.orderCode}</strong> —{" "}
            <strong style={{ color: "#f25c05" }}>
              {cancelDialog.totalAmount?.toLocaleString("vi-VN")}₫
            </strong>
          </DialogContentText>

          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <InputLabel>Lý do hủy *</InputLabel>
            <Select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              label="Lý do hủy *"
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="" disabled>— Chọn lý do —</MenuItem>
              {CANCEL_REASONS.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {cancelReason === "Khác" && (
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              label="Mô tả lý do"
              placeholder="Nhập lý do hủy đơn..."
              value={cancelCustomText}
              onChange={(e) => setCancelCustomText(e.target.value)}
              inputProps={{ maxLength: 500 }}
              sx={{ mb: 1.5 }}
            />
          )}

          {cancelDialog.isPaid && (
            <Alert severity="info" sx={{ mb: 1.5, borderRadius: 2 }}>
              Đơn này đã thanh toán. Chúng tôi sẽ hoàn tiền trong{" "}
              <strong>3–5 ngày làm việc</strong>.
            </Alert>
          )}

          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            Hành động này <strong>không thể hoàn tác</strong>.
          </Alert>

          {cancelError && (
            <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }}>
              {cancelError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={closeCancelDialog}
            disabled={cancelMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            disabled={cancelMutation.isPending || !cancelReason}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
          >
            {cancelMutation.isPending ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Toast ─────────────────────────────────────────────────── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
