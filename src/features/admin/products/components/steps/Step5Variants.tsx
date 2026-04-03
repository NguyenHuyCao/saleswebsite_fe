"use client";
import { useState } from "react";
import {
  Box, Button, Chip, IconButton, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Typography, Switch, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { Mutations, useVariants } from "../../queries";
import type { ProductVariant } from "../../types";

const EMPTY: Omit<ProductVariant, "id"> = {
  size: "", color: "", sku: "", stockQuantity: 0, priceOverride: null, active: true,
};

export default function Step5Variants({
  productId,
  onBack,
  onDone,
}: {
  productId: number;
  onBack?: () => void;
  onDone?: () => void;
}) {
  const { data: variants, loading, refetch } = useVariants(productId);
  const [dialog, setDialog] = useState<{ open: boolean; editing: ProductVariant | null }>({
    open: false, editing: null,
  });
  const [form, setForm] = useState<Omit<ProductVariant, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" as "success" | "error" });

  const openCreate = () => {
    setForm(EMPTY);
    setDialog({ open: true, editing: null });
  };

  const openEdit = (v: ProductVariant) => {
    setForm({ size: v.size, color: v.color, sku: v.sku, stockQuantity: v.stockQuantity, priceOverride: v.priceOverride, active: v.active });
    setDialog({ open: true, editing: v });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (dialog.editing) {
        await Mutations.variants.update(dialog.editing.id, form);
      } else {
        await Mutations.variants.create(productId, form);
      }
      await refetch();
      setDialog({ open: false, editing: null });
      setToast({ open: true, message: "Lưu biến thể thành công!", type: "success" });
    } catch (e: any) {
      setToast({ open: true, message: e.message || "Lỗi lưu biến thể", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xoá biến thể này?")) return;
    try {
      await Mutations.variants.delete(id);
      await refetch();
      setToast({ open: true, message: "Đã xoá biến thể", type: "success" });
    } catch (e: any) {
      setToast({ open: true, message: e.message || "Lỗi xoá biến thể", type: "error" });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h6" fontWeight={700}>
        Bước 5: Quản lý biến thể sản phẩm
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Thêm các biến thể (kích cỡ × màu sắc) cho sản phẩm. Mỗi biến thể có tồn kho riêng.
      </Typography>

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Thêm biến thể
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
      ) : variants.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Kích cỡ</TableCell>
              <TableCell>Màu sắc</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Tồn kho</TableCell>
              <TableCell align="right">Giá riêng (₫)</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.size || "—"}</TableCell>
                <TableCell>{v.color || "—"}</TableCell>
                <TableCell>{v.sku || "—"}</TableCell>
                <TableCell align="right">{v.stockQuantity.toLocaleString()}</TableCell>
                <TableCell align="right">
                  {v.priceOverride ? v.priceOverride.toLocaleString() : "Theo SP"}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={v.active ? "Đang bán" : "Ngừng bán"}
                    color={v.active ? "success" : "default"}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => openEdit(v)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(v.id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Box display="flex" justifyContent={onBack ? "space-between" : "flex-end"}>
        {onBack && (
          <Button variant="outlined" onClick={onBack}>Quay lại</Button>
        )}
        {onDone && (
          <Button variant="contained" color="success" onClick={onDone}>
            Hoàn tất
          </Button>
        )}
      </Box>

      {/* Dialog create/edit */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, editing: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog.editing ? "Sửa biến thể" : "Thêm biến thể"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Kích cỡ (ví dụ: S, M, L, XL, 39, 40...)"
              value={form.size ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Màu sắc (ví dụ: Đỏ, Xanh, Đen...)"
              value={form.color ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
              fullWidth
            />
            <TextField
              label="SKU (mã nội bộ, tùy chọn)"
              value={form.sku ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Tồn kho"
              type="number"
              value={form.stockQuantity}
              onChange={(e) => setForm((p) => ({ ...p, stockQuantity: Math.max(0, Number(e.target.value)) }))}
              fullWidth
            />
            <TextField
              label="Giá riêng (₫) — để trống = theo giá sản phẩm"
              type="number"
              value={form.priceOverride ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, priceOverride: e.target.value === "" ? null : Number(e.target.value) }))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                />
              }
              label="Đang bán"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, editing: null })}>Huỷ</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={18} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
