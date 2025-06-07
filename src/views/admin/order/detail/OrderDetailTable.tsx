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
} from "@mui/material";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";

const TAX_RATE = 0.07;
const ccyFormat = (num: number) => `${num.toLocaleString("vi-VN")} ₫`;

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // fallback nếu không parse được
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

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  promotions?: {
    promotionName: string;
    discount: number;
    maxDiscount: number;
    discountAmount: number;
  }[];
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

const OrderDetailTable = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
        if (!res.ok || data.status !== 200) {
          throw new Error(data.message || "Lỗi xác nhận COD");
        }

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

  if (!order) return <div>Đang tải dữ liệu...</div>;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const fieldStyle = {
    flex: "1 1 calc(50% - 16px)",
    minWidth: 250,
    mb: 1.5,
  };

  return (
    <Box>
      {/* Thông tin người đặt */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Thông tin người đặt hàng"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              fullWidth
              size="small"
              label="Họ tên"
              value={order.user.userName}
              InputProps={{ readOnly: true }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Email"
              value={order.user.email}
              InputProps={{ readOnly: true }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Số điện thoại"
              value={order.user.phone}
              InputProps={{ readOnly: true }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Địa chỉ người dùng"
              value={order.user.address}
              InputProps={{ readOnly: true }}
              sx={fieldStyle}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Chi tiết đơn hàng */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Chi tiết đơn hàng"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              fullWidth
              size="small"
              label="Ngày đặt hàng"
              value={formatDateTime(order.createdAt)}
              InputProps={{ readOnly: true }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Địa chỉ giao hàng"
              value={order.shippingAddress}
              InputProps={{ readOnly: true }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Phương thức thanh toán"
              value={order.paymentMethod}
              InputProps={{ readOnly: true }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Ngày thanh toán"
              value={formatDateTime(order.paidAt)}
              InputProps={{ readOnly: true }}
              sx={fieldStyle}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Cập nhật trạng thái */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Cập nhật trạng thái"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                ...fieldStyle,
                flex: "1 1 40%",
                backgroundColor: "#fef3c7",
                borderRadius: 2,
              }}
            >
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

            <FormControl
              fullWidth
              size="small"
              sx={{
                ...fieldStyle,
                flex: "1 1 60%",
                backgroundColor: "#e0f7fa",
                borderRadius: 2,
              }}
            >
              <InputLabel>Trạng thái đơn hàng</InputLabel>
              <Select
                value={orderStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                label="Trạng thái đơn hàng"
              >
                {Object.entries(orderStatusMap).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Bảng sản phẩm */}
      <Card>
        <CardHeader
          title="Sản phẩm trong đơn hàng"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="center">Khuyến mãi</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="center">
                      {item.promotions && item.promotions.length > 0 ? (
                        item.promotions.map((promo, idx) => (
                          <span
                            key={idx}
                            style={{ fontSize: "0.85rem", display: "block" }}
                          >
                            {promo.promotionName} –{" "}
                            {Math.round(promo.discount * 100)}% (↓{" "}
                            {ccyFormat(promo.discountAmount)})
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "#888", fontSize: "0.85rem" }}>
                          Không có
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {ccyFormat(item.unitPrice)}
                    </TableCell>
                    <TableCell align="right">
                      {ccyFormat(item.quantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 500 }}>
                    Tạm tính
                  </TableCell>
                  <TableCell align="right">{ccyFormat(subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 500 }}>
                    Thuế VAT ({(TAX_RATE * 100).toFixed(0)}%)
                  </TableCell>
                  <TableCell align="right">{ccyFormat(tax)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 600 }}>
                    Tổng tiền
                  </TableCell>
                  <TableCell align="right">{ccyFormat(total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <GlobalSnackbar
        open={snackbarOpen}
        type={snackbarType}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default OrderDetailTable;
