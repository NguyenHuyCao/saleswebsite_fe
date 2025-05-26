"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Button,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface OrderData {
  orderId: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  shippingMethod: string;
  totalAmount: number;
  createdAt: string;
  paymentStatus: string;
  paidAt: string | null;
  moneyChannel: string | null;
}

const columns = [
  { id: "orderId", label: "Mã đơn", minWidth: 80 },
  { id: "status", label: "Trạng thái", minWidth: 100 },
  { id: "paymentMethod", label: "Thanh toán", minWidth: 100 },
  { id: "shippingMethod", label: "Giao hàng", minWidth: 120 },
  { id: "totalAmount", label: "Tổng tiền", minWidth: 120 },
  { id: "createdAt", label: "Ngày tạo", minWidth: 120 },
  { id: "actions", label: "", minWidth: 100 },
];

const fakeData: OrderData[] = [
  {
    orderId: 1,
    status: "DELIVERED",
    shippingAddress: "456 Trần Hưng Đạo, Quy Nhơn",
    paymentMethod: "COD",
    shippingMethod: "LOCAL_SHIPPER",
    totalAmount: 1000000,
    createdAt: "2025-05-20T11:56:02.709506Z",
    paymentStatus: "PAID",
    paidAt: "2025-05-21T05:22:19.373866Z",
    moneyChannel: "COD",
  },
  {
    orderId: 2,
    status: "PENDING",
    shippingAddress: "456 Trần Hưng Đạo, Quy Nhơn",
    paymentMethod: "COD",
    shippingMethod: "LOCAL_SHIPPER",
    totalAmount: 1000000,
    createdAt: "2025-05-20T12:14:56.794158Z",
    paymentStatus: "PENDING",
    paidAt: null,
    moneyChannel: null,
  },
  {
    orderId: 3,
    status: "PENDING",
    shippingAddress: "456 Trần Hưng Đạo, Quy Nhơn",
    paymentMethod: "COD",
    shippingMethod: "LOCAL_SHIPPER",
    totalAmount: 1000000,
    createdAt: "2025-05-21T05:43:48.204448Z",
    paymentStatus: "PENDING",
    paidAt: null,
    moneyChannel: null,
  },
  {
    orderId: 4,
    status: "DELIVERED",
    shippingAddress: "456 Trần Hưng Đạo, Quy Nhơn",
    paymentMethod: "COD",
    shippingMethod: "LOCAL_SHIPPER",
    totalAmount: 1000000,
    createdAt: "2025-05-21T07:15:11.359583Z",
    paymentStatus: "PENDING",
    paidAt: null,
    moneyChannel: null,
  },
];

const OrderTablePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    setOrders(fakeData.slice(start, end));
  }, [page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewDetails = (orderId: number) => {
    // Navigate to order details page
    router.push(`/admin/orders/detail?orderId=${orderId}`);
  };

  return (
    <Card>
      <CardHeader
        title="Danh sách đơn hàng"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="order table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || "left"}
                      sx={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={order.orderId}
                  >
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{order.shippingMethod}</TableCell>
                    <TableCell>
                      {order.totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell onClick={() => handleViewDetails(order.orderId)}>
                      <Button size="small" variant="outlined">
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[3, 5, 10]}
            component="div"
            count={fakeData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </CardContent>
    </Card>
  );
};

export default OrderTablePage;
