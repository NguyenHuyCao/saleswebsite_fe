"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Modal,
  Typography,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import GlobalSnackbar from "@/components/feedback/GlobalSnackbar";
import {
  useConfirmCodPaid,
  useOrder,
  useRefundOrder,
  useUpdateOrderStatus,
} from "../queries";

const TAX_RATE = 0.07;
const ccy = (n: number) => `${n.toLocaleString("vi-VN")} ₫`;
const dt = (s: string | null) =>
  !s
    ? "-"
    : new Date(s).toLocaleString("vi-VN", {
        hour12: false,
        dateStyle: "short",
        timeStyle: "short",
      });

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  WAITING_PAYMENT: "Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang vận chuyển",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã huỷ",
  FAILED: "Thất bại",
};

export default function OrderDetailTable() {
  const orderId = useSearchParams().get("orderId");
  const { data: order } = useOrder(orderId || undefined);

  const [snOpen, setSnOpen] = useState(false);
  const [snType, setSnType] = useState<"success" | "error">("success");
  const [snMsg, setSnMsg] = useState("");

  const [refundModal, setRefundModal] = useState({ open: false, amount: 0 });
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundDetailId, setRefundDetailId] = useState<number | null>(null);

  const updateStatus = useUpdateOrderStatus(orderId || "");
  const confirmCOD = useConfirmCodPaid(orderId || "");
  const refundMut = useRefundOrder(Number(orderId || 0));

  const subtotal = useMemo(
    () =>
      (order?.items ?? []).reduce(
        (sum, i) => sum + i.quantity * i.unitPrice,
        0
      ),
    [order]
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (!order)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );

  const onPaymentChange = async (val: string) => {
    if (val !== "PAID") return;
    try {
      await confirmCOD.mutateAsync();
      setSnType("success");
      setSnMsg("Đã xác nhận thanh toán COD");
    } catch (e: any) {
      setSnType("error");
      setSnMsg(e?.message || "Lỗi xác nhận COD");
    } finally {
      setSnOpen(true);
    }
  };

  const onStatusChange = async (val: string) => {
    try {
      await updateStatus.mutateAsync(val);
      setSnType("success");
      setSnMsg("Cập nhật trạng thái thành công");
    } catch (e: any) {
      setSnType("error");
      setSnMsg(e?.message || "Lỗi cập nhật trạng thái");
    } finally {
      setSnOpen(true);
    }
  };

  const openRefund = (amount: number, detailId: number) => {
    setRefundModal({ open: true, amount });
    setRefundAmount(String(amount));
    setRefundDetailId(detailId);
  };

  const confirmRefund = async () => {
    if (!refundDetailId) return;
    try {
      await refundMut.mutateAsync({
        orderDetailId: refundDetailId,
        refundAmount: Number(refundAmount),
      });
      setSnType("success");
      setSnMsg("Hoàn tiền thành công");
    } catch (e: any) {
      setSnType("error");
      setSnMsg(e?.message || "Hoàn tiền thất bại");
    } finally {
      setSnOpen(true);
      setRefundModal({ open: false, amount: 0 });
    }
  };

  return (
    <Grid container spacing={4}>
      {/* Thông tin người đặt hàng */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title="Thông tin người đặt hàng" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Họ tên"
                  fullWidth
                  size="small"
                  value={order.user.userName}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
                  value={order.user.email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  size="small"
                  value={order.user.phone}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Địa chỉ"
                  fullWidth
                  size="small"
                  value={order.user.address}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Chi tiết đơn hàng */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title="Chi tiết đơn hàng" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mã đơn hàng"
                  value={order.orderCode ?? `#${order.orderId}`}
                  InputProps={{ readOnly: true, sx: { fontFamily: "monospace" } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ngày đặt hàng"
                  value={dt(order.createdAt)}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Địa chỉ giao hàng"
                  value={order.shippingAddress}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phương thức thanh toán"
                  value={order.paymentMethod}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ngày thanh toán"
                  value={dt(order.paidAt)}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ngày giao hàng"
                  value={dt(order.deliveredAt ?? null)}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Cập nhật trạng thái */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title="Cập nhật trạng thái" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái thanh toán</InputLabel>
                  <Select
                    value={order.paymentStatus}
                    onChange={(e) => onPaymentChange(e.target.value)}
                    label="Trạng thái thanh toán"
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="PENDING">Chờ thanh toán</MenuItem>
                    <MenuItem value="PAID">Đã thanh toán</MenuItem>
                    <MenuItem value="REFUND_PENDING">Chờ hoàn tiền</MenuItem>
                    <MenuItem value="CANCELLED">Đã huỷ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái đơn hàng</InputLabel>
                  <Select
                    value={order.status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    label="Trạng thái đơn hàng"
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {Object.entries(ORDER_STATUS_LABEL).map(([val, label]) => (
                      <MenuItem key={val} value={val}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Sản phẩm */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title="Sản phẩm trong đơn hàng" />
        </Card>
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="center">Khuyến mãi</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                    <TableCell align="center">Hoàn tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="center">
                        {item.promotions?.length ? (
                          item.promotions.map((p, j) => (
                            <div key={j}>
                              {p.promotionName} – {Math.round(p.discount * 100)}
                              %
                            </div>
                          ))
                        ) : (
                          <span style={{ opacity: 0.4 }}>Không có</span>
                        )}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{ccy(item.unitPrice)}</TableCell>
                      <TableCell align="right">
                        {ccy(item.unitPrice * item.quantity)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            openRefund(
                              item.unitPrice * item.quantity,
                              item.productDetailId
                            )
                          }
                        >
                          Hoàn tiền
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell rowSpan={3} />
                    <TableCell colSpan={3} align="right">
                      Tạm tính
                    </TableCell>
                    <TableCell align="right">{ccy(subtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      Thuế VAT
                    </TableCell>
                    <TableCell align="right">{ccy(tax)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      Tổng cộng
                    </TableCell>
                    <TableCell align="right">{ccy(total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Modal hoàn tiền */}
      <Modal
        open={refundModal.open}
        onClose={() => setRefundModal({ ...refundModal, open: false })}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 360,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Xác nhận hoàn tiền
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Số tiền cần hoàn"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ min: 0 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setRefundModal({ ...refundModal, open: false })}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={confirmRefund}
              disabled={!refundAmount || Number(refundAmount) <= 0}
            >
              Hoàn tiền
            </Button>
          </Box>
        </Box>
      </Modal>

      <GlobalSnackbar
        open={snOpen}
        type={snType}
        message={snMsg}
        onClose={() => setSnOpen(false)}
      />
    </Grid>
  );
}
