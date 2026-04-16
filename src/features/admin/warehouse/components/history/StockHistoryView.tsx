"use client";

import {
  Box, Card, CardContent, CardHeader, Chip, CircularProgress,
  Divider, MenuItem, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography, Paper,
} from "@mui/material";
import { useState } from "react";
import { useWarehouses, useTransactions } from "../../queries";
import type { TxnType } from "../../types";

const TYPE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  { value: "IMPORT", label: "Nhập hàng" },
  { value: "EXPORT_ONLINE", label: "Xuất online" },
  { value: "EXPORT_STORE", label: "Xuất tại quầy" },
  { value: "RETURN", label: "Hoàn hàng" },
  { value: "TRANSFER_OUT", label: "Chuyển kho đi" },
  { value: "TRANSFER_IN", label: "Chuyển kho đến" },
  { value: "ADJUSTMENT", label: "Điều chỉnh" },
];

const TYPE_COLOR: Record<TxnType, "success" | "error" | "info" | "warning" | "default"> = {
  IMPORT:       "success",
  EXPORT_ONLINE:"error",
  EXPORT_STORE: "error",
  RETURN:       "warning",
  TRANSFER_OUT: "info",
  TRANSFER_IN:  "info",
  ADJUSTMENT:   "default",
};

const TYPE_LABEL: Record<TxnType, string> = {
  IMPORT:       "Nhập hàng",
  EXPORT_ONLINE:"Xuất online",
  EXPORT_STORE: "Xuất quầy",
  RETURN:       "Hoàn hàng",
  TRANSFER_OUT: "Chuyển đi",
  TRANSFER_IN:  "Chuyển đến",
  ADJUSTMENT:   "Điều chỉnh",
};

export default function StockHistoryView() {
  const { data: warehouses = [] } = useWarehouses();

  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading } = useTransactions({
    warehouseId: warehouseId || undefined,
    type: type || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page: 1,
    size: 100,
  });

  const transactions = data?.result ?? [];

  return (
    <Card>
      <CardHeader title="Lịch sử biến động tồn kho" />
      <Divider />

      {/* Filters */}
      <CardContent sx={{ pb: 1 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end" flexWrap="wrap">
          <TextField
            select size="small" label="Kho" sx={{ minWidth: 180 }}
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value ? Number(e.target.value) : "")}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            <MenuItem value="">Tất cả kho</MenuItem>
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select size="small" label="Loại giao dịch" sx={{ minWidth: 180 }}
            value={type}
            onChange={(e) => setType(e.target.value)}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            {TYPE_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            size="small" label="Từ ngày" type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            size="small" label="Đến ngày" type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
        </Stack>
      </CardContent>

      <TableContainer component={Paper} variant="outlined" sx={{ mx: 2, mb: 2, borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Mã GD</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kho</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Trước</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Thay đổi</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Sau</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Người tạo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && transactions.map((txn) => {
              const txnType = txn.type as TxnType;
              return (
                <TableRow key={txn.id} hover>
                  <TableCell>
                    <Typography variant="caption" fontFamily="monospace">{txn.transactionCode}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={TYPE_LABEL[txnType] ?? txn.type}
                      color={TYPE_COLOR[txnType] ?? "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{txn.warehouseName}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{txn.productName}</Typography>
                    {txn.variantDesc && (
                      <Typography variant="caption" color="text.secondary">{txn.variantDesc}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{txn.quantityBefore.toLocaleString("vi-VN")}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={txn.quantityChange >= 0 ? "success.main" : "error.main"}
                    >
                      {txn.quantityChange >= 0 ? "+" : ""}{txn.quantityChange.toLocaleString("vi-VN")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{txn.quantityAfter.toLocaleString("vi-VN")}</TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleString("vi-VN") : "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>{txn.createdBy ?? "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
