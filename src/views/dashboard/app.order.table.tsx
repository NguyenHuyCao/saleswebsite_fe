"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TableChartIcon from "@mui/icons-material/TableChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

interface LatestOrder {
  orderId: number;
  totalAmount: number;
  totalQuantity: number;
  orderStatus: string;
  paymentStatus: string;
  customerName: string;
}

const HEADERS = ["Mã đơn", "Khách hàng", "Tổng tiền (VND)", "Số lượng", "Trạng thái đơn", "Trạng thái TT"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const statusColorMap: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  PENDING: "warning",
  DELIVERED: "success",
  CANCELLED: "error",
  PAID: "success",
};

const OrderTable = () => {
  const [orders, setOrders] = useState<LatestOrder[]>([]);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const list = await api.get<LatestOrder[]>(
          "/api/v1/dashboard/overview/latest-orders",
          { signal: controller.signal }
        );
        setOrders(Array.isArray(list) ? list.slice(0, 9) : []);
      } catch (err) {
        logIfNotCanceled(err, "Lỗi khi gọi API latest-orders:");
        setOrders([]);
      }
    })();
    return () => controller.abort();
  }, []);

  /* ── Row builder ── */
  const buildRows = () =>
    orders.map((o) => [
      `#${o.orderId}`,
      o.customerName,
      o.totalAmount,
      o.totalQuantity,
      o.orderStatus,
      o.paymentStatus,
    ]);

  /* ── CSV ── */
  const exportCsv = () => {
    const rows = buildRows();
    const csv =
      "\uFEFF" +
      [HEADERS, ...rows]
        .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    trigger(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "latest-orders.csv");
  };

  /* ── Excel ── */
  const exportExcel = async () => {
    const XLSX = await import("xlsx");
    const rows = buildRows();
    const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);
    ws["!cols"] = HEADERS.map((h, i) =>
      ({ wch: Math.max(h.length, ...rows.map((r) => String(r[i]).length)) + 2 })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Đơn hàng");
    XLSX.writeFile(wb, "latest-orders.xlsx");
  };

  /* ── PDF (browser print) ── */
  const exportPdf = () => {
    const rows = buildRows();
    const tableHtml = `
      <table>
        <thead>
          <tr>${HEADERS.map((h) => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>`;

    const win = window.open("", "_blank", "width=1000,height=600");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Đơn hàng gần đây</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; color: #333; }
    h2 { font-size: 15px; margin-bottom: 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
    th { background: #f0f0f0; font-weight: 700; }
    tr:nth-child(even) td { background: #fafafa; }
    @media print { @page { size: A4 landscape; margin: 15mm; } }
  </style>
</head>
<body>
  <h2>Đơn hàng gần đây</h2>
  ${tableHtml}
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`);
    win.document.close();
  };

  const trigger = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Đơn hàng gần đây</Typography>

        <Button
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(e) => setExportAnchor(e.currentTarget)}
          disabled={orders.length === 0}
        >
          Xuất dữ liệu
        </Button>

        <Menu
          anchorEl={exportAnchor}
          open={!!exportAnchor}
          onClose={() => setExportAnchor(null)}
          disableScrollLock
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => { exportCsv(); setExportAnchor(null); }}>
            <ListItemIcon><GridOnIcon fontSize="small" /></ListItemIcon>
            CSV (.csv)
          </MenuItem>
          <MenuItem onClick={() => { exportExcel(); setExportAnchor(null); }}>
            <ListItemIcon><TableChartIcon fontSize="small" sx={{ color: "success.main" }} /></ListItemIcon>
            Excel (.xlsx)
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { exportPdf(); setExportAnchor(null); }}>
            <ListItemIcon><PictureAsPdfIcon fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>
            PDF (In / Lưu)
          </MenuItem>
        </Menu>
      </Box>

      {/* Table */}
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
              <TableCell align="right">{formatCurrency(order.totalAmount)}</TableCell>
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
