"use client";

import {
  Box, Button, Card, CardContent, CardHeader, Chip, CircularProgress,
  Divider, IconButton, MenuItem, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useState } from "react";
import { useToast } from "@/lib/toast/ToastContext";
import {
  useWarehouses,
  useImports,
  useImportDetail,
  useConfirmImport,
  useCancelImport,
} from "../../queries";
import type { ImportStatus } from "../../types";
import ImportFormDialog from "./ImportFormDialog";
import ImportDetailDialog from "./ImportDetailDialog";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "DRAFT", label: "Nháp" },
  { value: "CONFIRMED", label: "Đã nhập" },
  { value: "CANCELLED", label: "Đã huỷ" },
];

const STATUS_MAP: Record<ImportStatus, { label: string; color: "default" | "warning" | "success" | "error" }> = {
  DRAFT:     { label: "Nháp",    color: "default" },
  CONFIRMED: { label: "Đã nhập", color: "success" },
  CANCELLED: { label: "Đã huỷ", color: "error" },
};

export default function ImportListView() {
  const { showToast } = useToast();
  const { data: warehouses = [] } = useWarehouses();

  // Filters
  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [status, setStatus] = useState("");
  const [page] = useState(1);

  const { data, isLoading, refetch } = useImports({
    warehouseId: warehouseId || undefined,
    status: status || undefined,
    page,
    size: 20,
  });

  const imports = data?.result ?? [];

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

  const { data: detailData, isLoading: detailLoading } = useImportDetail(detailId ?? 0);

  // Actions
  const confirmMutation = useConfirmImport();
  const cancelMutation = useCancelImport();

  const handleConfirm = async (id: number, code: string) => {
    if (!confirm(`Xác nhận nhập kho phiếu ${code}?`)) return;
    try {
      await confirmMutation.mutateAsync(id);
      showToast("Nhập kho thành công", "success");
    } catch (e: any) {
      showToast(e?.message ?? "Lỗi xác nhận nhập kho", "error");
    }
  };

  const handleCancel = async (id: number, code: string) => {
    if (!confirm(`Huỷ phiếu nhập ${code}?`)) return;
    try {
      await cancelMutation.mutateAsync(id);
      showToast("Đã huỷ phiếu nhập", "success");
    } catch (e: any) {
      showToast(e?.message ?? "Lỗi huỷ phiếu nhập", "error");
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader
          title="Phiếu nhập hàng"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
            >
              Tạo phiếu nhập
            </Button>
          }
        />

        <Divider />

        {/* Filter bar */}
        <CardContent sx={{ pb: 1 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end">
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
              select size="small" label="Trạng thái" sx={{ minWidth: 150 }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
              {STATUS_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>

            <Button size="small" variant="outlined" onClick={() => refetch()}>
              Tải lại
            </Button>
          </Stack>
        </CardContent>

        {/* Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mx: 2, mb: 2, borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã phiếu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Kho nhập</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Số SP</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Tổng tiền (₫)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Người tạo</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && imports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && imports.map((imp) => {
                const s = STATUS_MAP[imp.status];
                return (
                  <TableRow key={imp.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{imp.importCode}</Typography>
                    </TableCell>
                    <TableCell>{imp.warehouseName}</TableCell>
                    <TableCell align="right">{imp.items?.length ?? 0}</TableCell>
                    <TableCell align="right">{imp.totalCost.toLocaleString("vi-VN")}</TableCell>
                    <TableCell>
                      <Chip label={s.label} color={s.color} size="small" />
                    </TableCell>
                    <TableCell>
                      {imp.createdAt ? new Date(imp.createdAt).toLocaleDateString("vi-VN") : "—"}
                    </TableCell>
                    <TableCell>{imp.createdBy ?? "—"}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" onClick={() => setDetailId(imp.id)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {imp.status === "DRAFT" && (
                          <>
                            <Tooltip title="Xác nhận nhập kho">
                              <IconButton
                                size="small" color="success"
                                onClick={() => handleConfirm(imp.id, imp.importCode)}
                                disabled={confirmMutation.isPending}
                              >
                                <CheckCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Huỷ phiếu">
                              <IconButton
                                size="small" color="error"
                                onClick={() => handleCancel(imp.id, imp.importCode)}
                                disabled={cancelMutation.isPending}
                              >
                                <CancelOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create dialog */}
      <ImportFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      {/* Detail dialog */}
      <ImportDetailDialog
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        data={detailData ?? null}
        loading={detailLoading && detailId !== null}
      />
    </Box>
  );
}
