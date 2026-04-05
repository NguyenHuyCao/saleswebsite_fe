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
import { useMemo, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppState } from "@/redux/store";
import { useOrders } from "../../queries";
import type { OrderListItem } from "../../types";

interface Column {
  id: string;
  label: string;
  minWidth: number;
  align?: "right" | "left" | "center";
}

const columns: Column[] = [
  { id: "orderCode", label: "Mã đơn", minWidth: 150 },
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
  const { data, isLoading } = useOrders();
  const rows = (data?.result ?? []) as OrderListItem[];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();

  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );

  const filtered = useMemo(() => {
    if (!keyword) return rows;
    return rows.filter((order) => {
      const fields = [
        order.orderCode ?? "",
        String(order.orderId),
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
  }, [rows, keyword]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Card>
      <CardHeader
        title="Danh sách đơn hàng"
        titleTypographyProps={{ variant: "h6" }}
        action={isLoading ? "Đang tải..." : null}
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
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order.orderId} hover>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                        {order.orderCode ?? `#${order.orderId}`}
                      </TableCell>
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
                          onClick={() =>
                            router.push(
                              `/admin/orders?page=detail&orderId=${order.orderId}`
                            )
                          }
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
            count={filtered.length}
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
