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

const TAX_RATE = 0.07;
const ccyFormat = (num: number) => `${num.toLocaleString("vi-VN")} ₫`;

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
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
              InputProps={{ readOnly: true, sx: { fontSize: "0.875rem" } }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Email"
              value={order.user.email}
              InputProps={{ readOnly: true, sx: { fontSize: "0.875rem" } }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Số điện thoại"
              value={order.user.phone}
              InputProps={{ readOnly: true, sx: { fontSize: "0.875rem" } }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Địa chỉ người dùng"
              value={order.user.address}
              InputProps={{ readOnly: true, sx: { fontSize: "0.875rem" } }}
              sx={fieldStyle}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={`Chi tiết đơn hàng`}
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              fullWidth
              size="small"
              label="Ngày đặt hàng"
              value={new Date(order.createdAt).toLocaleString("vi-VN")}
              InputProps={{ readOnly: true, sx: { fontSize: "0.875rem" } }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Địa chỉ giao hàng"
              value={order.shippingAddress}
              InputProps={{ readOnly: true, sx: { fontSize: "0.875rem" } }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Phương thức thanh toán"
              value={order.paymentMethod}
              InputProps={{ readOnly: true, sx: { fontSize: "0.875rem" } }}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Ngày thanh toán"
              value={
                order.paidAt
                  ? new Date(order.paidAt).toLocaleString("vi-VN")
                  : "-"
              }
              InputProps={{ readOnly: true, sx: { fontSize: "0.875rem" } }}
              sx={fieldStyle}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4, border: "1px solid #f0f0f0" }}>
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
                flex: "1 1 calc(40% - 16px)",
                backgroundColor: "#fef3c7",
                borderRadius: 2,
              }}
            >
              <InputLabel>Trạng thái thanh toán</InputLabel>
              <Select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                label="Trạng thái thanh toán"
                sx={{ fontSize: "0.875rem" }}
              >
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="PAID">PAID</MenuItem>
                <MenuItem value="FAILED">FAILED</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={{
                ...fieldStyle,
                flex: "1 1 calc(60% - 16px)",
                backgroundColor: "#e0f7fa",
                borderRadius: 2,
              }}
            >
              <InputLabel>Trạng thái đơn hàng</InputLabel>
              <Select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                label="Trạng thái đơn hàng"
                sx={{ fontSize: "0.875rem" }}
              >
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                <MenuItem value="FAILED">FAILED</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Sản phẩm trong đơn hàng"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
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
                  <TableCell colSpan={2}>Tạm tính</TableCell>
                  <TableCell align="right">{ccyFormat(subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Thuế VAT</TableCell>
                  <TableCell align="right">
                    {(TAX_RATE * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell align="right">{ccyFormat(tax)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Tổng tiền</TableCell>
                  <TableCell align="right">{ccyFormat(total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetailTable;
