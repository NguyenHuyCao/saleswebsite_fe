"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TableChartIcon from "@mui/icons-material/TableChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

interface UserFinance {
  totalSpent: number;
  gender: string;
  joinedAt: string;
  totalProducts: number;
  fullName: string;
  email: string;
  status: boolean;
}

const HEADERS = ["Họ và tên", "Email", "Giới tính", "Ngày tham gia", "Số SP đã mua", "Đã chi tiêu (VND)", "Trạng thái"];

const DashboardTable = () => {
  const [users, setUsers] = useState<UserFinance[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const payload = await api.get<UserFinance[] | { result: UserFinance[] }>(
          "/api/v1/dashboard/overview/user-finance",
          { signal: controller.signal }
        );
        const list: UserFinance[] = Array.isArray(payload)
          ? payload
          : ((payload as any)?.result ?? []);
        setUsers(Array.isArray(list) ? list : []);
      } catch (error) {
        logIfNotCanceled(error, "Error fetching user finance data:");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  /* ── Helpers ── */
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("vi-VN");
  const formatCurrency = (v: number) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const buildRows = () =>
    users.map((u) => [
      u.fullName,
      u.email,
      u.gender ?? "",
      formatDate(u.joinedAt),
      u.totalProducts,
      u.totalSpent,
      u.status ? "Hoạt động" : "Bị khoá",
    ]);

  /* ── CSV ── */
  const exportCsv = () => {
    const rows = buildRows();
    const csv =
      "\uFEFF" +
      [HEADERS, ...rows]
        .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    trigger(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "user-finance.csv");
  };

  /* ── Excel ── */
  const exportExcel = async () => {
    const XLSX = await import("xlsx");
    const rows = buildRows();
    const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);
    // Column widths
    ws["!cols"] = HEADERS.map((h, i) =>
      ({ wch: Math.max(h.length, ...rows.map((r) => String(r[i]).length)) + 2 })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Người dùng");
    XLSX.writeFile(wb, "user-finance.xlsx");
  };

  /* ── PDF (browser print — perfect Vietnamese rendering) ── */
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

    const win = window.open("", "_blank", "width=1100,height=700");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Thống kê tài chính người dùng</title>
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
  <h2>Thống kê tài chính người dùng</h2>
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

  /* ── Pagination ── */
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      {/* Header */}
      <Box sx={{ px: 3, pt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Thống kê tài chính người dùng</Typography>

        <Button
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(e) => setExportAnchor(e.currentTarget)}
          disabled={users.length === 0}
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
      <TableContainer ref={tableRef}>
        <Table sx={{ minWidth: 800 }} aria-label="Bảng người dùng chi tiêu">
          <TableHead>
            <TableRow>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Ngày tham gia</TableCell>
              <TableCell>Số SP đã mua</TableCell>
              <TableCell>Đã chi tiêu</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow hover key={user.email}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500, fontSize: "0.875rem !important" }}>
                      {user.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{formatDate(user.joinedAt)}</TableCell>
                  <TableCell>{user.totalProducts}</TableCell>
                  <TableCell>{formatCurrency(user.totalSpent)}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status ? "Hoạt động" : "Bị khoá"}
                      color={user.status ? "success" : "error"}
                      sx={{ height: 24, fontSize: "0.75rem", "& .MuiChip-label": { fontWeight: 500 } }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        labelRowsPerPage="Số dòng mỗi trang:"
        SelectProps={{ MenuProps: { disableScrollLock: true } }}
      />
    </Card>
  );
};

export default DashboardTable;
