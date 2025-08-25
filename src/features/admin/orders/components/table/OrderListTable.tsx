"use client";

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
import { useEffect, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppState } from "@/redux/store";

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
  user: { email: string; phone: string };
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    meta: { page: number; pageSize: number; pages: number; total: number };
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
  { id: "orderId", label: "Mã đơn", minWidth: 80 },
  { id: "email", label: "Email", minWidth: 160 },
  { id: "phone", label: "SĐT", minWidth: 120 },
  { id: "status", label: "Trạng thái", minWidth: 100, align: "center" },
  { id: "paymentMethod", label: "Thanh toán", minWidth: 100, align: "center" },
  { id: "shippingMethod", label: "Giao hàng", minWidth: 120, align: "center" },
  { id: "totalAmount", label: "Tổng tiền", minWidth: 120, align: "right" },
  { id: "createdAt", label: "Ngày tạo", minWidth: 120, align: "center" },
  { id: "actions", label: "", minWidth: 100, align: "center" },
];

export default function OrderListTable() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const router = useRouter();
  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders?page=1&size=1000`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Không thể lấy dữ liệu");
        const json: ApiResponse = await res.json();
        setOrders(json.data.result);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const fields = [
        order.orderId.toString(),
        order.user.email,
        order.user.phone,
        order.status,
        order.paymentMethod,
        order.shippingMethod,
        order.totalAmount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        new Date(order.createdAt).toLocaleDateString("vi-VN"),
      ];
      return fields.some((f) => f.toLowerCase().includes(keyword));
    });
    setFilteredOrders(filtered);
    setPage(0);
  }, [orders, keyword]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
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
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((c) => (
                    <TableCell
                      key={c.id}
                      align={c.align || "left"}
                      sx={{ minWidth: c.minWidth }}
                    >
                      {c.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order.orderId} hover>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.user.email}</TableCell>
                      <TableCell>{order.user.phone}</TableCell>
                      <TableCell align="center">{order.status}</TableCell>
                      <TableCell align="center">
                        {order.paymentMethod}
                      </TableCell>
                      <TableCell align="center">
                        {order.shippingMethod}
                      </TableCell>
                      <TableCell align="right">
                        {order.totalAmount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
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
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Hiển thị"
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          />
        </Paper>
      </CardContent>
    </Card>
  );
}
