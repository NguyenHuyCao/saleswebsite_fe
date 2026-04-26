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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppState } from "@/redux/store";
import { useOrders } from "../../queries";
import type { OrderListItem } from "../../types";

/* ─── Constants ─────────────────────────────────────────────────── */

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "PENDING",         label: "Chờ xác nhận" },
  { value: "WAITING_PAYMENT", label: "Chờ thanh toán" },
  { value: "CONFIRMED",       label: "Đã xác nhận" },
  { value: "SHIPPING",        label: "Đang vận chuyển" },
  { value: "DELIVERED",       label: "Đã giao hàng" },
  { value: "CANCELLED",       label: "Đã huỷ" },
  { value: "FAILED",          label: "Thất bại" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "Tất cả TT thanh toán" },
  { value: "PENDING",        label: "Chờ thanh toán" },
  { value: "PAID",           label: "Đã thanh toán" },
  { value: "REFUND_PENDING", label: "Chờ hoàn tiền" },
  { value: "CANCELLED",      label: "Đã huỷ" },
  { value: "FAILED",         label: "Thất bại" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "", label: "Tất cả PTTT" },
  { value: "COD",   label: "COD" },
  { value: "MOMO",  label: "MoMo" },
  { value: "VNPAY", label: "VNPay / Chuyển khoản" },
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Mới nhất" },
  { value: "oldest",     label: "Cũ nhất" },
  { value: "amount_desc",label: "Giá trị cao → thấp" },
  { value: "amount_asc", label: "Giá trị thấp → cao" },
];

const columns = [
  { id: "orderCode",     label: "Mã đơn",    minWidth: 150 },
  { id: "email",         label: "Email",      minWidth: 160 },
  { id: "phone",         label: "SĐT",        minWidth: 120 },
  { id: "status",        label: "Đơn hàng",   minWidth: 130, align: "center" as const },
  { id: "paymentStatus", label: "Thanh toán", minWidth: 130, align: "center" as const },
  { id: "paymentMethod", label: "PTTT",       minWidth: 100, align: "center" as const },
  { id: "shippingMethod",label: "Giao hàng",  minWidth: 120, align: "center" as const },
  { id: "totalAmount",   label: "Tổng tiền",  minWidth: 120, align: "right" as const },
  { id: "createdAt",     label: "Ngày tạo",   minWidth: 120, align: "center" as const },
  { id: "actions",       label: "",           minWidth: 100, align: "center" as const },
];

const labelOf = (opts: { value: string; label: string }[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

/* ─── Component ─────────────────────────────────────────────────── */

export default function OrderListTable() {
  const { data, isLoading } = useOrders();
  const rows = (data?.result ?? []) as OrderListItem[];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();

  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );

  const hasFilter =
    Boolean(statusFilter) ||
    Boolean(paymentStatusFilter) ||
    Boolean(paymentMethodFilter);

  const clearFilters = () => {
    setStatusFilter("");
    setPaymentStatusFilter("");
    setPaymentMethodFilter("");
    setPage(0);
  };

  const filtered = useMemo(() => {
    let result = rows;

    if (statusFilter)
      result = result.filter((o) => o.status === statusFilter);
    if (paymentStatusFilter)
      result = result.filter((o) => o.paymentStatus === paymentStatusFilter);
    if (paymentMethodFilter)
      result = result.filter((o) => o.paymentMethod === paymentMethodFilter);

    if (keyword)
      result = result.filter((order) => {
        const fields = [
          order.orderCode ?? "",
          String(order.orderId),
          order.user?.email ?? "",
          order.user?.phone ?? "",
          order.status ?? "",
          order.paymentMethod ?? "",
        ];
        return fields.some((f) => f.toLowerCase().includes(keyword));
      });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount_desc":
          return b.totalAmount - a.totalAmount;
        case "amount_asc":
          return a.totalAmount - b.totalAmount;
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [rows, keyword, statusFilter, paymentStatusFilter, paymentMethodFilter, sortBy]);

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
        action={
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center", mr: 1 }}>
            {isLoading ? "Đang tải..." : `${filtered.length} đơn hàng`}
          </Typography>
        }
      />
      <CardContent>
        {/* Filter bar */}
        <Box sx={{ mb: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sắp xếp"
              MenuProps={{ disableScrollLock: true }}
            >
              {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Trạng thái đơn</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              label="Trạng thái đơn"
              MenuProps={{ disableScrollLock: true }}
            >
              {ORDER_STATUS_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Thanh toán</InputLabel>
            <Select
              value={paymentStatusFilter}
              onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(0); }}
              label="Thanh toán"
              MenuProps={{ disableScrollLock: true }}
            >
              {PAYMENT_STATUS_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Phương thức</InputLabel>
            <Select
              value={paymentMethodFilter}
              onChange={(e) => { setPaymentMethodFilter(e.target.value); setPage(0); }}
              label="Phương thức"
              MenuProps={{ disableScrollLock: true }}
            >
              {PAYMENT_METHOD_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          {hasFilter && (
            <Button size="small" variant="outlined" color="error" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </Box>

        {/* Active filter chips */}
        {hasFilter && (
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={1.5}>
            {statusFilter && (
              <Chip
                label={`Đơn hàng: ${labelOf(ORDER_STATUS_OPTIONS, statusFilter)}`}
                size="small" onDelete={() => { setStatusFilter(""); setPage(0); }}
              />
            )}
            {paymentStatusFilter && (
              <Chip
                label={`Thanh toán: ${labelOf(PAYMENT_STATUS_OPTIONS, paymentStatusFilter)}`}
                size="small" onDelete={() => { setPaymentStatusFilter(""); setPage(0); }}
              />
            )}
            {paymentMethodFilter && (
              <Chip
                label={`PTTT: ${labelOf(PAYMENT_METHOD_OPTIONS, paymentMethodFilter)}`}
                size="small" onDelete={() => { setPaymentMethodFilter(""); setPage(0); }}
              />
            )}
          </Stack>
        )}

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((c) => (
                    <TableCell
                      key={c.id}
                      align={c.align || "left"}
                      sx={{ minWidth: c.minWidth, fontWeight: 700 }}
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
                      <TableCell>{order.user?.email ?? "—"}</TableCell>
                      <TableCell>{order.user?.phone ?? "—"}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={labelOf(ORDER_STATUS_OPTIONS, order.status)}
                          size="small"
                          color={
                            order.status === "DELIVERED" ? "success" :
                            order.status === "CANCELLED" || order.status === "FAILED" ? "error" :
                            order.status === "SHIPPING" ? "info" :
                            order.status === "CONFIRMED" ? "primary" : "default"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={labelOf(PAYMENT_STATUS_OPTIONS, order.paymentStatus)}
                          size="small"
                          color={
                            order.paymentStatus === "PAID" ? "success" :
                            order.paymentStatus === "REFUND_PENDING" ? "warning" :
                            order.paymentStatus === "CANCELLED" || order.paymentStatus === "FAILED" ? "error" :
                            "default"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {labelOf(PAYMENT_METHOD_OPTIONS, order.paymentMethod)}
                      </TableCell>
                      <TableCell align="center">{order.shippingMethod}</TableCell>
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
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: "text.secondary" }}>
                      Không tìm thấy đơn hàng
                    </TableCell>
                  </TableRow>
                )}
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
