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
  user: {
    email: string;
    phone: string;
  };
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: OrderData[];
  };
}

interface Column {
  id: string;
  label: string;
  minWidth: number;
  align?: "right" | "left" | "center";
}

const columns: Column[] = [
  { id: "orderId", label: "Mã đơn", minWidth: 80, align: "left" },
  { id: "email", label: "Email", minWidth: 160, align: "left" },
  { id: "phone", label: "SĐT", minWidth: 120, align: "left" },
  { id: "status", label: "Trạng thái", minWidth: 100, align: "center" },
  { id: "paymentMethod", label: "Thanh toán", minWidth: 100, align: "center" },
  { id: "shippingMethod", label: "Giao hàng", minWidth: 120, align: "center" },
  { id: "totalAmount", label: "Tổng tiền", minWidth: 120, align: "right" },
  { id: "createdAt", label: "Ngày tạo", minWidth: 120, align: "center" },
  { id: "actions", label: "", minWidth: 100, align: "center" },
];

const OrderTablePage = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/orders?page=${
          page + 1
        }&size=${rowsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Lỗi khi gọi API");
      const json: ApiResponse = await res.json();
      setOrders(json.data.result);
      setTotalRows(json.data.meta.total);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewDetails = (orderId: number) => {
    router.push(`/admin/orders?page=detail&orderId=${orderId}`);
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
            <Table stickyHeader>
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
                  <TableRow key={order.orderId} hover>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.user.email}</TableCell>
                    <TableCell>{order.user.phone}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{order.shippingMethod}</TableCell>
                    <TableCell align="right">
                      {order.totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(order.orderId)}
                      >
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
            count={totalRows}
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
