"use client";

import { useEffect, useState } from "react";
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
  Grid,
  Modal,
  Typography,
  CircularProgress,
} from "@mui/material";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";

interface Promotion {
  promotionName: string;
  discount: number;
  maxDiscount: number;
  discountAmount: number;
}

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  promotions?: Promotion[];
}

interface UserInfo {
  userId: number;
  userName: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderData {
  orderId: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  shippingMethod: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  paymentStatus: string;
  paidAt: string | null;
  user: UserInfo;
}

const TAX_RATE = 0.07;
const ccyFormat = (num: number) => `${num.toLocaleString("vi-VN")} ₫`;

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString("vi-VN", {
    hour12: false,
    dateStyle: "short",
    timeStyle: "short",
  });
};

const orderStatusMap: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã huỷ",
};

const OrderDetailTable = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundDetailId, setRefundDetailId] = useState<number | null>(null);
  const [refundModal, setRefundModal] = useState({ open: false, amount: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleRefundClick = (amount: number, detailId: number) => {
    setRefundModal({ open: true, amount });
    setRefundAmount(String(amount));
    setRefundDetailId(detailId);
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/orders/${orderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Lỗi khi gọi API đơn hàng");
        const json = await res.json();
        setOrder(json.data);
        setPaymentStatus(json.data.paymentStatus);
        setOrderStatus(json.data.status);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePaymentStatusChange = async (newStatus: string) => {
    setPaymentStatus(newStatus);
    if (newStatus === "PAID" && order && paymentStatus !== "PAID") {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/payments/${order.orderId}/cod-paid`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok || data.status !== 200)
          throw new Error(data.message || "Lỗi xác nhận COD");
        setSnackbarType("success");
        setSnackbarMessage(data.message || "Đã xác nhận thanh toán thành công");
      } catch (error: any) {
        setSnackbarType("error");
        setSnackbarMessage(
          error?.message || "Đã xảy ra lỗi khi xác nhận thanh toán COD"
        );
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  const handleStatusChange = async (value: string) => {
    if (!order) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/orders/${order.orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            status: value,
            shippingStatusFromPartner: null,
          }),
        }
      );
      if (!res.ok) throw new Error("Lỗi khi cập nhật trạng thái");
      setOrderStatus(value);
    } catch (err) {
      console.error(err);
    }
  };
  const handleRefundConfirm = async () => {
    if (!order || !refundDetailId) return;
    try {
      const res = await fetch("http://localhost:8080/api/v1/refund_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          orderId: order.orderId,
          orderDetailId: refundDetailId,
          refundAmount: Number(refundAmount),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 200)
        throw new Error(data.message || "Hoàn tiền thất bại");
      setSnackbarType("success");
      setSnackbarMessage(data.message || "Hoàn tiền thành công");
    } catch (err: any) {
      setSnackbarType("error");
      setSnackbarMessage(err.message || "Lỗi trong quá trình hoàn tiền");
    } finally {
      setSnackbarOpen(true);
      setRefundModal({ open: false, amount: 0 });
    }
  };

  if (!order)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  console.log("order", order);

  return (
    <Grid container spacing={4}>
      {/* Thông tin người đặt hàng */}
      <Grid size={{ xs: 6 }}>
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
      <Grid size={{ xs: 6 }}>
        <Card>
          <CardHeader title="Chi tiết đơn hàng" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ngày đặt hàng"
                  value={formatDateTime(order.createdAt)}
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
                  value={formatDateTime(order.paidAt)}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Trạng thái */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title="Cập nhật trạng thái" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái thanh toán</InputLabel>
                  <Select
                    value={paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(e.target.value)}
                    label="Trạng thái thanh toán"
                  >
                    <MenuItem value="PENDING">CHỜ THANH TOÁN</MenuItem>
                    <MenuItem value="PAID">ĐÃ THANH TOÁN</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái đơn hàng</InputLabel>
                  <Select
                    value={orderStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    label="Trạng thái đơn hàng"
                  >
                    {Object.entries(orderStatusMap).map(([val, label]) => (
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

      {/* Bảng sản phẩm */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title="Sản phẩm trong đơn hàng" />
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
                          <span style={{ color: "#888" }}>Không có</span>
                        )}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {ccyFormat(item.unitPrice)}
                      </TableCell>
                      <TableCell align="right">
                        {ccyFormat(item.unitPrice * item.quantity)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleRefundClick(
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
                    <TableCell align="right">{ccyFormat(subtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      Thuế VAT
                    </TableCell>
                    <TableCell align="right">{ccyFormat(tax)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      Tổng cộng
                    </TableCell>
                    <TableCell align="right">{ccyFormat(total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

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
              color="primary"
              onClick={handleRefundConfirm}
              disabled={!refundAmount || Number(refundAmount) <= 0}
            >
              Hoàn tiền
            </Button>
          </Box>
        </Box>
      </Modal>

      <GlobalSnackbar
        open={snackbarOpen}
        type={snackbarType}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Grid>
  );
};

export default OrderDetailTable;
