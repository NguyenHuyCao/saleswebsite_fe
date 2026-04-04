// warranty/components/WarrantyHistory.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getUserWarrantyRequests, type WarrantyClaimResponse } from "../api";

const statusLabel: Record<string, string> = {
  PENDING: "Chờ xử lý",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã huỷ",
};

const statusColor = (
  status: string
): "default" | "warning" | "success" | "error" | "info" => {
  switch (status) {
    case "PENDING":   return "warning";
    case "APPROVED":  return "success";
    case "REJECTED":  return "error";
    case "CANCELLED": return "default";
    default:          return "info";
  }
};

const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
};

export default function WarrantyHistory() {
  const [requests, setRequests] = useState<WarrantyClaimResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserWarrantyRequests()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !requests.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Box sx={{ my: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <HistoryIcon sx={{ color: "#0d47a1" }} />
          <Typography variant="h5" fontWeight={800} color="#333">
            Lịch sử yêu cầu bảo hành
          </Typography>
        </Stack>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Mã yêu cầu</TableCell>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Ngày gửi</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell>Phản hồi</TableCell>
                <TableCell align="right">Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} hover>
                  <TableCell sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                    {req.claimCode ?? `#${req.id}`}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                    {req.orderCode ?? "—"}
                  </TableCell>
                  <TableCell>{req.productName ?? "—"}</TableCell>
                  <TableCell>{fmtDate(req.submittedAt ?? req.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={statusLabel[req.status] ?? req.status}
                      size="small"
                      color={statusColor(req.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {req.resolutionNote ? (
                      <Tooltip title={req.resolutionNote} arrow>
                        <Typography
                          fontSize={12}
                          color="text.secondary"
                          sx={{
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            cursor: "default",
                          }}
                        >
                          {req.resolutionNote}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography fontSize={12} color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      href={`/warranty/${req.id}`}
                    >
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </motion.div>
  );
}
