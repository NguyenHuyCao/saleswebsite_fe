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
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import ShippingStatusChip from "./ShippingStatusChip";
import { useMyOrdersQuery, useCancelOrderMutation } from "../queries";
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

const PAYMENT_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PAID:           { label: "Đã thanh toán", color: "#4caf50" },
  PENDING:        { label: "Chờ thanh toán", color: "#ff9800" },
  REFUND_PENDING: { label: "Chờ hoàn tiền",  color: "#9c27b0" },
  CANCELLED:      { label: "Đã huỷ",         color: "#f44336" },
  UNKNOWN:        { label: "Chưa rõ",        color: "#9e9e9e" },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  COD:   "Thanh toán khi nhận hàng (COD)",
  MOMO:  "Ví MoMo",
  VNPAY: "VNPay / Chuyển khoản",
};

const CANCEL_REASONS = [
  "Tôi muốn thay đổi địa chỉ giao hàng",
  "Tôi muốn thay đổi sản phẩm/số lượng",
  "Tôi tìm được giá tốt hơn ở nơi khác",
  "Thời gian giao hàng quá lâu",
  "Tôi đặt nhầm sản phẩm",
  "Khác",
];

function PaymentStatusBadge({ status }: { status?: string }) {
  const info = PAYMENT_STATUS_LABEL[status ?? "UNKNOWN"] ?? PAYMENT_STATUS_LABEL.UNKNOWN;
  return (
    <Chip
      label={info.label}
      size="small"
      sx={{
        bgcolor: `${info.color}1A`,
        color: info.color,
        border: `1px solid ${info.color}55`,
        fontWeight: 600,
        fontSize: "0.65rem",
      }}
    />
  );
}

export default function OrderListSection({
  filterStatus = "all",
  searchTerm = "",
  dateRange = { start: null, end: null },
}: OrderListSectionProps) {
  const router = useRouter();
  const { data: orders = [], isLoading } = useMyOrdersQuery();
  const cancelMutation = useCancelOrderMutation();

  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Cancel dialog state
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    orderId: number | string | null;
    orderCode: string;
    totalAmount: number;
    isPaid: boolean;
  }>({ open: false, orderId: null, orderCode: "", totalAmount: 0, isPaid: false });
  const [cancelReasonSelect, setCancelReasonSelect] = useState("");
  const [cancelReasonText, setCancelReasonText] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filterStatus !== "all" && order.status !== filterStatus) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchCode = order.orderCode?.toLowerCase().includes(q);
        const matchId   = order.orderId.toString().includes(q);
        if (!matchCode && !matchId) return false;
      }
      if (dateRange.start) {
        const orderDate = new Date(order.createdAt);
        if (orderDate < dateRange.start.toDate()) return false;
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

  const handleCopyOrderCode = (orderCode: string) => {
    navigator.clipboard.writeText(orderCode);
    setCopiedId(orderCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // canCancel: PENDING hoặc CONFIRMED (không cho SHIPPING/DELIVERED/CANCELLED)
  const canCancel = (status: string) =>
    status === "PENDING" || status === "CONFIRMED";

  const openCancelDialog = (
    orderId: number | string,
    orderCode: string,
    totalAmount: number,
    isPaid: boolean,
  ) => {
    setCancelError(null);
    setCancelReasonSelect("");
    setCancelReasonText("");
    setCancelDialog({ open: true, orderId, orderCode, totalAmount, isPaid });
  };

  const closeCancelDialog = () => {
    setCancelDialog({ open: false, orderId: null, orderCode: "", totalAmount: 0, isPaid: false });
  };

  const getReasonValue = () => {
    if (cancelReasonSelect === "Khác") return cancelReasonText.trim();
    return cancelReasonSelect;
  };

  const handleConfirmCancel = async () => {
    if (!cancelDialog.orderId) return;
    const reason = getReasonValue();
    try {
      await cancelMutation.mutateAsync({ orderId: cancelDialog.orderId, reason: reason || undefined });
      closeCancelDialog();
      setToast({ open: true, message: "Đơn hàng đã được huỷ thành công.", severity: "success" });
    } catch (e: any) {
      setCancelError(e?.message || "Không thể huỷ đơn. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <Box mt={4}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} variant="rounded" height={120} sx={{ borderRadius: 3, mb: 2 }} />
        ))}
      </Box>
    );
  }

  if (!orders?.length) {
    return (
      <Paper
        sx={{
          p: 6, textAlign: "center", bgcolor: "#fafafa",
          borderRadius: 4, border: "2px dashed #ffb700", mt: 4,
        }}
      >
        <ShoppingBagIcon sx={{ fontSize: 60, color: "#ffb700", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Bạn chưa có đơn hàng nào
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Hãy khám phá các sản phẩm và đặt hàng ngay!
        </Typography>
        <Button variant="contained" href="/products" sx={{ bgcolor: "#f25c05" }}>
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị <strong>{paginatedOrders.length}</strong> /{" "}
          <strong>{filteredOrders.length}</strong> đơn hàng
        </Typography>
        {pageCount > 1 && (
          <Pagination
            count={pageCount} page={page} onChange={(_, p) => setPage(p)}
            shape="rounded" color="primary" size="small"
          />
        )}
      </Stack>

      <AnimatePresence>
        {paginatedOrders.map((order: any) => {
          const orderCodeDisplay = order.orderCode || `#${order.orderId}`;
          const isPaid = order.paymentStatus === "PAID";
          return (
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
                  mb: 2, borderRadius: 3, overflow: "hidden",
                  border: "1px solid #f0f0f0", transition: "all 0.3s",
                  "&:hover": { boxShadow: "0 8px 20px rgba(242,92,5,0.1)", borderColor: "#ffb700" },
                }}
              >
                {/* Order Summary Header – always visible */}
                <CardContent
                  sx={{ p: 2.5, cursor: "pointer", "&:last-child": { pb: 2.5 } }}
                  onClick={() => toggleExpand(order.orderId)}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Left – Order Code + Date */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography fontWeight={700} color="#f25c05" fontSize="1rem">
                          {orderCodeDisplay}
                        </Typography>
                        <Tooltip title="Sao chép mã đơn">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyOrderCode(orderCodeDisplay);
                            }}
                            sx={{ p: 0.5 }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 16, color: "#999" }} />
                          </IconButton>
                        </Tooltip>
                        {copiedId === orderCodeDisplay && (
                          <Chip
                            label="Đã copy!"
                            size="small"
                            sx={{ height: 18, fontSize: "0.5rem", bgcolor: "#4caf50", color: "#fff" }}
                          />
                        )}
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: "#999" }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(order.createdAt)}
                        </Typography>
                      </Stack>
                    </Grid>

                    {/* Middle – Total + Order Status */}
                    <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">Tổng tiền</Typography>
                      <Typography fontWeight={700} color="#f25c05" fontSize="1.1rem">
                        {order.totalAmount?.toLocaleString()}₫
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                      <Stack spacing={0.5}>
                        <ShippingStatusChip status={order.status} />
                        {order.paymentStatus && order.paymentStatus !== "UNKNOWN" && (
                          <PaymentStatusBadge status={order.paymentStatus} />
                        )}
                      </Stack>
                    </Grid>

                    {/* Right – Actions */}
                    <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                      <Stack
                        direction="row" spacing={1}
                        justifyContent={{ xs: "flex-start", md: "flex-end" }}
                      >
                        <Tooltip title="Theo dõi đơn hàng">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/order/tracking/${order.orderId}`);
                            }}
                            sx={{ bgcolor: "#e3f2fd", color: "#1976d2", width: 32, height: 32 }}
                          >
                            <LocalShippingIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Hỗ trợ">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); router.push("/contact"); }}
                            sx={{ bgcolor: "#fff8e1", color: "#f57c00", width: 32, height: 32 }}
                          >
                            <HelpOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Bảo hành">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); router.push("/warranty#warranty-request"); }}
                            sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", width: 32, height: 32 }}
                          >
                            <BuildCircleIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        {canCancel(order.status) && (
                          <Tooltip title="Huỷ đơn hàng">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                openCancelDialog(order.orderId, orderCodeDisplay, order.totalAmount, isPaid);
                              }}
                              sx={{ bgcolor: "#fce4ec", color: "#c62828", width: 32, height: 32 }}
                            >
                              <CancelIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Chi tiết">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); toggleExpand(order.orderId); }}
                            sx={{ bgcolor: "#f3e5f5", color: "#7b1fa2", width: 32, height: 32 }}
                          >
                            {expandedOrder === order.orderId
                              ? <ExpandLessIcon sx={{ fontSize: 18 }} />
                              : <ExpandMoreIcon sx={{ fontSize: 18 }} />
                            }
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
                        <Typography fontWeight={600} sx={{ mb: 2, color: "#333" }}>
                          📦 Sản phẩm đã mua
                        </Typography>
                        <Stack spacing={2}>
                          {order.items?.map((item: any, i: number) => (
                            <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 60, height: 60, borderRadius: 2,
                                    overflow: "hidden", position: "relative",
                                    border: "1px solid #f0f0f0", flexShrink: 0,
                                  }}
                                >
                                  {item.imageUrl ? (
                                    <Image
                                      src={item.imageUrl} alt={item.productName}
                                      fill style={{ objectFit: "cover" }}
                                    />
                                  ) : (
                                    <Avatar variant="square" sx={{ width: 60, height: 60, bgcolor: "#f5f5f5" }}>
                                      📦
                                    </Avatar>
                                  )}
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                  <Typography fontWeight={600} fontSize={14}>
                                    {item.productName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Số lượng: {item.quantity} x {item.unitPrice.toLocaleString()}₫
                                  </Typography>
                                  {item.promotions?.length > 0 && (
                                    <Chip
                                      label={`KM: ${item.promotions.map((p: any) => p.promotionName).join(", ")}`}
                                      size="small"
                                      sx={{ mt: 0.5, display: "block", fontSize: "0.6rem", bgcolor: "#fff8e1" }}
                                    />
                                  )}
                                </Box>

                                <Typography fontWeight={700} color="#f25c05">
                                  {(item.quantity * item.unitPrice).toLocaleString()}₫
                                </Typography>

                                {order.status === "DELIVERED" && (
                                  <Button
                                    size="small" variant="outlined"
                                    startIcon={<RateReviewIcon />}
                                    onClick={() => router.push(`/review?product=${item.productName}`)}
                                    sx={{ borderColor: "#ffb700", color: "#f25c05", "&:hover": { bgcolor: "#fff8f0" } }}
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

                      {/* Info Grid */}
                      <Grid container spacing={2}>
                        {/* Shipping */}
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: "#f25c05" }}>
                              🚚 Giao hàng
                            </Typography>
                            {/* Use component="div" to avoid <p> nesting block elements */}
                            <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1 }}>
                              <strong>Địa chỉ:</strong> {order.shippingAddress || "—"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div">
                              <strong>Phương thức:</strong>{" "}
                              {order.shippingMethod === "EXPRESS"
                                ? "Giao nhanh"
                                : order.shippingMethod === "STANDARD"
                                ? "Giao tiêu chuẩn"
                                : order.shippingMethod || "—"}
                            </Typography>
                          </Paper>
                        </Grid>

                        {/* Payment */}
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                            <Box component="div" sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                              <PaymentIcon sx={{ fontSize: 16, color: "#f25c05" }} />
                              <Typography variant="subtitle2" fontWeight={600} color="#f25c05" component="span">
                                Thanh toán
                              </Typography>
                            </Box>
                            <Stack spacing={0.5}>
                              <Typography variant="body2" color="text.secondary" component="div">
                                <strong>Phương thức:</strong>{" "}
                                {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod || "—"}
                              </Typography>
                              {/* FIX: component="div" prevents <p> containing <div> (Chip) */}
                              <Typography variant="body2" color="text.secondary" component="div">
                                <strong>Trạng thái:</strong>{" "}
                                <PaymentStatusBadge status={order.paymentStatus} />
                              </Typography>
                              {order.paidAmount != null && order.paidAmount > 0 && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                  <strong>Đã thanh toán:</strong>{" "}
                                  <span style={{ color: "#4caf50", fontWeight: 700 }}>
                                    {order.paidAmount.toLocaleString()}₫
                                  </span>
                                </Typography>
                              )}
                              {order.paidAt && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                  <strong>Thời gian:</strong> {formatDateTime(order.paidAt)}
                                </Typography>
                              )}
                              {order.transferContent && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                  <strong>Nội dung CK:</strong>{" "}
                                  <span style={{ fontFamily: "monospace", color: "#f25c05" }}>
                                    {order.transferContent}
                                  </span>
                                </Typography>
                              )}
                              {order.status === "WAITING_PAYMENT" && order.paymentMethod !== "COD" && (
                                <Button
                                  size="small" variant="outlined"
                                  onClick={() => router.push(`/payment/${order.orderId}?method=${order.paymentMethod}`)}
                                  sx={{ mt: 1, borderColor: "#f25c05", color: "#f25c05", fontSize: "0.7rem" }}
                                >
                                  Thanh toán ngay
                                </Button>
                              )}
                            </Stack>
                          </Paper>
                        </Grid>

                        {/* Timeline */}
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: "#f25c05" }}>
                              ⏱️ Thời gian
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1 }}>
                              <strong>Đặt hàng:</strong> {formatDateTime(order.createdAt)}
                            </Typography>
                            {order.status === "DELIVERED" && order.deliveredAt && (
                              <Typography variant="body2" color="text.secondary" component="div">
                                <strong>Đã nhận:</strong> {formatDateTime(order.deliveredAt)}
                              </Typography>
                            )}
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Total Summary */}
                      <Paper sx={{ p: 2, bgcolor: "#fff8f0", borderRadius: 2, border: "1px solid #ffb700" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={600}>Tổng cộng</Typography>
                          <Typography variant="h6" fontWeight={700} color="#f25c05">
                            {order.totalAmount?.toLocaleString()}₫
                          </Typography>
                        </Stack>
                      </Paper>

                      {/* Cancel button in expanded view (fallback) */}
                      {canCancel(order.status) && (
                        <Box>
                          <Button
                            variant="outlined" color="error" size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => openCancelDialog(order.orderId, orderCodeDisplay, order.totalAmount, isPaid)}
                          >
                            Huỷ đơn hàng này
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={closeCancelDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: "#c62828", fontWeight: 700 }}>
          Huỷ đơn hàng?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Đơn hàng <strong>{cancelDialog.orderCode}</strong> —{" "}
            <strong style={{ color: "#f25c05" }}>
              {cancelDialog.totalAmount?.toLocaleString()}₫
            </strong>
          </DialogContentText>

          {/* Lý do hủy */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Lý do huỷ</InputLabel>
            <Select
              value={cancelReasonSelect}
              onChange={(e) => setCancelReasonSelect(e.target.value)}
              label="Lý do huỷ"
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="">— Chọn lý do —</MenuItem>
              {CANCEL_REASONS.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {cancelReasonSelect === "Khác" && (
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              label="Mô tả lý do"
              value={cancelReasonText}
              onChange={(e) => setCancelReasonText(e.target.value)}
              inputProps={{ maxLength: 500 }}
              sx={{ mb: 2 }}
            />
          )}

          {/* Thông báo hoàn tiền nếu đã thanh toán */}
          {cancelDialog.isPaid && (
            <Alert severity="info" sx={{ mb: 1 }}>
              Đơn này đã được thanh toán. Chúng tôi sẽ hoàn tiền trong vòng{" "}
              <strong>3–5 ngày làm việc</strong>.
            </Alert>
          )}

          <Alert severity="warning" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Alert>

          {cancelError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {cancelError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeCancelDialog} disabled={cancelMutation.isPending}>
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "Đang xử lý..." : "Xác nhận huỷ"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
