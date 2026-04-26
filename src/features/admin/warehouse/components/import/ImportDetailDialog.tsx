"use client";

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Chip, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, Box, Stack, Divider,
  CircularProgress,
} from "@mui/material";
import type { ImportStatus, StockImport } from "../../types";

const STATUS_MAP: Record<ImportStatus, { label: string; color: "default" | "warning" | "success" | "error" }> = {
  DRAFT:     { label: "Nháp",      color: "default" },
  CONFIRMED: { label: "Đã nhập",   color: "success" },
  CANCELLED: { label: "Đã huỷ",    color: "error" },
};

interface Props {
  open: boolean;
  onClose: () => void;
  data: StockImport | null;
  loading?: boolean;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500} component="div" sx={{ mt: 0.25 }}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

export default function ImportDetailDialog({ open, onClose, data, loading }: Props) {
  if (!open) return null;

  const status = data ? STATUS_MAP[data.status] : null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle>
        Chi tiết phiếu nhập hàng
        {data && (
          <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
            {data.importCode}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {!loading && data && (
          <>
            {/* Header info */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={2}>
              <Box flex={1}>
                <InfoRow label="Mã phiếu" value={data.importCode} />
                <InfoRow label="Kho nhập" value={data.warehouseName} />
                <InfoRow label="Người tạo" value={data.createdBy} />
              </Box>
              <Box flex={1}>
                <InfoRow
                  label="Trạng thái"
                  value={
                    status && (
                      <Chip label={status.label} color={status.color} size="small" />
                    )
                  }
                />
                <InfoRow
                  label="Ngày tạo"
                  value={data.createdAt ? new Date(data.createdAt).toLocaleString("vi-VN") : null}
                />
                {data.confirmedAt && (
                  <InfoRow
                    label="Ngày xác nhận"
                    value={new Date(data.confirmedAt).toLocaleString("vi-VN")}
                  />
                )}
              </Box>
            </Stack>

            {data.note && (
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary">Ghi chú</Typography>
                <Typography variant="body2" sx={{ mt: 0.25 }}>{data.note}</Typography>
              </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            {/* Items table */}
            <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
              Danh sách hàng nhập ({data.items?.length ?? 0} sản phẩm)
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Variant</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Số lượng</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Giá nhập (₫)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Thành tiền (₫)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data.items ?? []).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.variantDesc ?? "—"}</TableCell>
                      <TableCell align="right">{item.quantity.toLocaleString("vi-VN")}</TableCell>
                      <TableCell align="right">{item.costPrice.toLocaleString("vi-VN")}</TableCell>
                      <TableCell align="right">{item.totalCost.toLocaleString("vi-VN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ textAlign: "right", mt: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Tổng tiền: {data.totalCost.toLocaleString("vi-VN")}₫
              </Typography>
            </Box>
          </>
        )}

        {!loading && !data && (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Không tìm thấy dữ liệu
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
