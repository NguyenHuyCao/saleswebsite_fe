"use client";

import {
  Card,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";

interface LatestOrder {
  orderId: number;
  totalAmount: number;
  totalQuantity: number;
  orderStatus: string;
  paymentStatus: string;
  customerName: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const statusColorMap: Record<
  string,
  "default" | "success" | "warning" | "error" | "info"
> = {
  PENDING: "warning",
  DELIVERED: "success",
  CANCELLED: "error",
  PAID: "success",
};

const OrderTable = () => {
  const [orders, setOrders] = useState<LatestOrder[]>([]);

  useEffect(() => {
    const fetchLatestOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          "http://localhost:8080/api/v1/dashboard/overview/latest-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        if (json.status === 200) {
          setOrders(json.data.slice(0, 9));
        }
      } catch (error) {
        console.error("Lỗi khi gọi API latest-orders:", error);
      }
    };

    fetchLatestOrders();
  }, []);

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Đơn hàng gần đây
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã đơn</TableCell>
            <TableCell align="right">Khách hàng</TableCell>
            <TableCell align="right">Tổng tiền</TableCell>
            <TableCell align="right">Số lượng</TableCell>
            <TableCell>Trạng thái đơn hàng</TableCell>
            <TableCell>Trạng thái thanh toán</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell>
                <Link color="secondary">#{order.orderId}</Link>
              </TableCell>
              <TableCell align="center">
                <Link color="secondary">{order.customerName}</Link>
              </TableCell>
              <TableCell align="right">
                {formatCurrency(order.totalAmount)}
              </TableCell>
              <TableCell align="right">{order.totalQuantity}</TableCell>
              <TableCell>
                <Chip
                  label={order.orderStatus}
                  color={statusColorMap[order.orderStatus] || "default"}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={order.paymentStatus}
                  color={statusColorMap[order.paymentStatus] || "default"}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OrderTable;
