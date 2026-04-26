"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Pagination,
  Alert,
  Skeleton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LinkIcon from "@mui/icons-material/Link";
import type { PaymentTransaction, TransactionStatus } from "./api";
import {
  getTransactions,
  getUnmatched,
  confirmTransaction,
  rejectTransaction,
  assignTransaction,
} from "./api";

const STATUS_COLOR: Record<TransactionStatus, "default" | "success" | "error" | "warning" | "info"> = {
  PENDING:       "info",
  RECEIVED:      "success",
  OVERPAID:      "warning",
  UNDERPAID:     "error",
  CONFIRMED:     "success",
  FAILED:        "error",
  REFUND_PENDING:"warning",
  LATE_PAYMENT:  "warning",
  UNMATCHED:     "default",
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  PENDING:       "Chờ xử lý",
  RECEIVED:      "Đã nhận",
  OVERPAID:      "Thừa tiền",
  UNDERPAID:     "Thiếu tiền",
  CONFIRMED:     "Đã xác nhận",
  FAILED:        "Thất bại",
  REFUND_PENDING:"Chờ hoàn tiền",
  LATE_PAYMENT:  "Thanh toán trễ",
  UNMATCHED:     "Chưa khớp",
};

const fmt = (n?: number | null) =>
  n != null ? n.toLocaleString("vi-VN") + "₫" : "—";

const fmtDate = (s?: string | null) =>
  s ? new Date(s).toLocaleString("vi-VN") : "—";

export default function AdminPaymentsView() {
  const [tab, setTab] = useState(0);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [unmatched, setUnmatched] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Confirm dialog
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmNote, setConfirmNote] = useState("");

  // Reject dialog
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Assign dialog
  const [assignId, setAssignId] = useState<number | null>(null);
  const [assignOrderId, setAssignOrderId] = useState("");
  const [assignNote, setAssignNote] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions({
        status: statusFilter || undefined,
        method: methodFilter || undefined,
        page: page - 1,
        size: 20,
      });
      setTransactions(result.content ?? []);
      setTotalPages(result.totalPages ?? 1);
    } catch (e: any) {
      setError(e?.message || "Không tải được danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, methodFilter]);

  const loadUnmatched = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUnmatched();
      setUnmatched(res);
    } catch (e: any) {
      setError(e?.message || "Không tải được giao dịch chưa khớp");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 0) loadTransactions();
    else loadUnmatched();
  }, [tab, loadTransactions, loadUnmatched]);

  const handleConfirm = async () => {
    if (!confirmId) return;
    setActionLoading(true);
    try {
      await confirmTransaction(confirmId, confirmNote || undefined);
      setSuccessMsg("Đã xác nhận giao dịch thành công");
      setConfirmId(null);
      setConfirmNote("");
      tab === 0 ? loadTransactions() : loadUnmatched();
    } catch (e: any) {
      setError(e?.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await rejectTransaction(rejectId, rejectReason);
      setSuccessMsg("Đã từ chối giao dịch");
      setRejectId(null);
      setRejectReason("");
      tab === 0 ? loadTransactions() : loadUnmatched();
    } catch (e: any) {
      setError(e?.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!assignId || !assignOrderId.trim()) return;
    setActionLoading(true);
    try {
      await assignTransaction(assignId, parseInt(assignOrderId), assignNote || undefined);
      setSuccessMsg("Đã gán giao dịch vào đơn hàng");
      setAssignId(null);
      setAssignOrderId("");
      setAssignNote("");
      tab === 0 ? loadTransactions() : loadUnmatched();
    } catch (e: any) {
      setError(e?.message);
    } finally {
      setActionLoading(false);
    }
  };

  const rows = tab === 0 ? transactions : unmatched;

  return (
    <Card>
      <CardHeader
        title="Quản lý Thanh toán QR"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center", mr: 1 }}>
            {loading ? "Đang tải..." : tab === 0 ? `${transactions.length} giao dịch` : `${unmatched.length} chưa khớp`}
          </Typography>
        }
      />
      <CardContent>
        {successMsg && (
          <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Tất cả giao dịch" />
          <Tab label={`Chưa khớp đơn (${unmatched.length})`} />
        </Tabs>

        {/* Filters (tab 0 only) */}
        {tab === 0 && (
          <Box sx={{ mb: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <MenuItem key={k} value={k}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Phương thức</InputLabel>
              <Select
                value={methodFilter}
                label="Phương thức"
                onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="MOMO">MoMo</MenuItem>
                <MenuItem value="VNPAY">VNPay</MenuItem>
                <MenuItem value="BANK">Ngân hàng</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={loadTransactions} size="small">
              Làm mới
            </Button>
          </Box>
        )}

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Đơn hàng</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Nguồn</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Nội dung</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Kỳ vọng</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Thực nhận</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Chênh lệch</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Người gửi</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 11 }).map((_, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 4, color: "text.secondary" }}>
                      Không có giao dịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((tx) => (
                    <TableRow key={tx.id} hover>
                      <TableCell>{tx.id}</TableCell>
                      <TableCell>
                        {tx.orderCode ? (
                          <Tooltip title={`Order ID: ${tx.orderId}`}>
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {tx.orderCode}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.3}>
                          <Chip label={tx.webhookSource} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                          <Chip label={tx.paymentMethod} size="small" sx={{ fontSize: 10 }} />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="warning.main">
                          {tx.transferContent ?? "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{fmt(tx.amountExpected)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{fmt(tx.amountReceived)}</TableCell>
                      <TableCell align="right">
                        {tx.difference != null ? (
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={tx.difference > 0 ? "warning.main" : tx.difference < 0 ? "error.main" : "success.main"}
                          >
                            {tx.difference > 0 ? "+" : ""}{fmt(tx.difference)}
                          </Typography>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={STATUS_LABEL[tx.status] ?? tx.status}
                          color={STATUS_COLOR[tx.status] ?? "default"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" display="block">{tx.senderName ?? "—"}</Typography>
                        <Typography variant="caption" color="text.secondary">{tx.senderAccount ?? ""}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">{fmtDate(tx.receivedAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          {(tx.status === "PENDING" || tx.status === "RECEIVED" ||
                            tx.status === "UNDERPAID" || tx.status === "OVERPAID" ||
                            tx.status === "LATE_PAYMENT") && (
                            <Tooltip title="Xác nhận">
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                sx={{ minWidth: 0, px: 1 }}
                                onClick={() => { setConfirmId(tx.id); setConfirmNote(""); }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </Button>
                            </Tooltip>
                          )}
                          {tx.status !== "CONFIRMED" && tx.status !== "FAILED" && (
                            <Tooltip title="Từ chối">
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                sx={{ minWidth: 0, px: 1 }}
                                onClick={() => { setRejectId(tx.id); setRejectReason(""); }}
                              >
                                <CancelIcon fontSize="small" />
                              </Button>
                            </Tooltip>
                          )}
                          {tx.orderId == null && (
                            <Tooltip title="Gán vào đơn">
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ minWidth: 0, px: 1 }}
                                onClick={() => { setAssignId(tx.id); setAssignOrderId(""); setAssignNote(""); }}
                              >
                                <LinkIcon fontSize="small" />
                              </Button>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {tab === 0 && totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
          </Box>
        )}
      </CardContent>

      {/* Confirm dialog */}
      <Dialog open={confirmId != null} onClose={() => setConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận thanh toán</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Ghi chú (tuỳ chọn)" multiline rows={2}
            value={confirmNote} onChange={(e) => setConfirmNote(e.target.value)} sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Hủy</Button>
          <Button variant="contained" color="success" onClick={handleConfirm} disabled={actionLoading}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={rejectId != null} onClose={() => setRejectId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Từ chối giao dịch</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth required label="Lý do từ chối" multiline rows={2}
            value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectId(null)}>Hủy</Button>
          <Button
            variant="contained" color="error" onClick={handleReject}
            disabled={actionLoading || !rejectReason.trim()}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign dialog */}
      <Dialog open={assignId != null} onClose={() => setAssignId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Gán vào đơn hàng</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth required label="Order ID" type="number"
            value={assignOrderId} onChange={(e) => setAssignOrderId(e.target.value)} sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth label="Ghi chú" multiline rows={2}
            value={assignNote} onChange={(e) => setAssignNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignId(null)}>Hủy</Button>
          <Button
            variant="contained" onClick={handleAssign}
            disabled={actionLoading || !assignOrderId.trim()}
          >
            Gán
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
