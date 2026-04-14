"use client";
import { useState, useMemo } from "react";
import {
  Box, Button, Chip, IconButton, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Typography, Switch, Dialog,
  DialogTitle, DialogContent, DialogActions, CircularProgress,
  Tooltip, Stack, Paper, Divider, FormControlLabel, Alert, LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BoltIcon from "@mui/icons-material/Bolt";
import CheckIcon from "@mui/icons-material/Check";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { Mutations, useVariants } from "../../queries";
import type { ProductVariant } from "../../types";
import { PRESET_COLORS, PRESET_SIZES, getColorHex, isLightColor } from "@/lib/utils/colorMap";

// ─── Swatch màu dùng trong admin ───────────────────────────────────────────

function AdminColorSwatch({
  name, selected, onClick,
}: { name: string; selected: boolean; onClick: () => void }) {
  const hex = getColorHex(name);
  const light = hex ? isLightColor(hex) : false;
  return (
    <Tooltip title={name} arrow>
      <Box
        onClick={onClick}
        sx={{
          width: 28, height: 28, borderRadius: "50%",
          bgcolor: hex || "#ccc",
          border: selected
            ? "3px solid #f25c05"
            : `2px solid ${light ? "#bbb" : "transparent"}`,
          outline: selected ? "2px solid rgba(242,92,5,0.35)" : "none",
          outlineOffset: 2,
          cursor: "pointer",
          transition: "all 0.15s",
          flexShrink: 0,
          "&:hover": { transform: "scale(1.2)" },
        }}
      />
    </Tooltip>
  );
}

// ─── Hiển thị màu trong bảng ─────────────────────────────────────────────

function ColorCell({ color }: { color: string | null }) {
  if (!color) return <Typography variant="body2" color="text.disabled">—</Typography>;
  const hex = getColorHex(color);
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      {hex && (
        <Box sx={{
          width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
          bgcolor: hex,
          border: `1px solid ${isLightColor(hex) ? "#ccc" : "transparent"}`,
        }} />
      )}
      <Typography variant="body2">{color}</Typography>
    </Stack>
  );
}

// ─── Hằng số ─────────────────────────────────────────────────────────────

const EMPTY: Omit<ProductVariant, "id"> = {
  size: null, color: null, sku: null, stockQuantity: 0, priceOverride: null, active: true,
};

// ─── Component chính ─────────────────────────────────────────────────────

export default function Step5Variants({
  productId, onBack, onDone, skipLabel, onSkip,
}: {
  productId: number;
  onBack?: () => void;
  onDone?: () => void;
  /** Nhãn nút bỏ qua (chỉ hiện với MACHINE) */
  skipLabel?: string;
  /** Callback khi bỏ qua bước variants */
  onSkip?: () => void;
}) {
  const { data: variants, loading, refetch } = useVariants(productId);

  // ── Batch generator state ────────────────────────────────────────────
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState({ done: 0, total: 0 });

  // ── Inline stock edit ────────────────────────────────────────────────
  const [dirtyStock, setDirtyStock] = useState<Record<number, number>>({});
  const [savingStock, setSavingStock] = useState<Set<number>>(new Set());

  // ── Add / Edit dialog ────────────────────────────────────────────────
  const [dialog, setDialog] = useState<{ open: boolean; editing: ProductVariant | null }>({
    open: false, editing: null,
  });
  const [form, setForm] = useState<Omit<ProductVariant, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);

  // ── Delete confirm ────────────────────────────────────────────────────
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ── Toast ─────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ open: false, message: "", type: "success" as "success" | "error" });
  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ open: true, message, type });

  // ── Tính tổ hợp mới (chưa tồn tại) ─────────────────────────────────
  const existingKeys = useMemo(
    () => new Set(variants.map((v) => `${v.size ?? ""}|${v.color ?? ""}`)),
    [variants],
  );

  const newCombos = useMemo(() => {
    const sizes = selectedSizes.length > 0 ? selectedSizes : [null];
    const colors = selectedColors.length > 0 ? selectedColors : [null];
    return sizes
      .flatMap((s) => colors.map((c) => ({ size: s, color: c })))
      .filter((combo) => !existingKeys.has(`${combo.size ?? ""}|${combo.color ?? ""}`));
  }, [selectedSizes, selectedColors, existingKeys]);

  // ── Toggle size/color trong generator ───────────────────────────────
  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleColor = (c: string) =>
    setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const addCustomSize = () => {
    const v = customSize.trim();
    if (v && !selectedSizes.includes(v)) setSelectedSizes((p) => [...p, v]);
    setCustomSize("");
  };

  const addCustomColor = () => {
    const v = customColor.trim();
    if (v && !selectedColors.includes(v)) setSelectedColors((p) => [...p, v]);
    setCustomColor("");
  };

  // ── Batch generate ───────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (newCombos.length === 0) return;
    if (selectedSizes.length === 0 && selectedColors.length === 0) {
      showToast("Chọn ít nhất một kích cỡ hoặc màu sắc.", "error");
      return;
    }
    setGenerating(true);
    setGenProgress({ done: 0, total: newCombos.length });
    let created = 0;
    let skipped = 0; // trùng (400)
    let authError = false;

    for (const combo of newCombos) {
      try {
        await Mutations.variants.create(productId, {
          size: combo.size, color: combo.color, sku: null,
          stockQuantity: 0, priceOverride: null, active: true,
        });
        created++;
      } catch (e: any) {
        const msg: string = e?.message ?? "";
        // 403 / "không có quyền" → dừng toàn bộ vòng lặp
        if (msg.toLowerCase().includes("quyền") || msg.toLowerCase().includes("access denied") || msg.toLowerCase().includes("forbidden")) {
          authError = true;
          break;
        }
        // 400 trùng → đếm và tiếp tục
        skipped++;
      }
      setGenProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    await refetch();
    setGenerating(false);
    setGenProgress({ done: 0, total: 0 });
    setSelectedSizes([]);
    setSelectedColors([]);

    if (authError) {
      showToast("Bạn không có quyền tạo biến thể. Vui lòng kiểm tra lại tài khoản.", "error");
    } else {
      const skipNote = skipped > 0 ? ` (${skipped} bỏ qua do trùng)` : "";
      showToast(`Đã tạo ${created} biến thể mới.${skipNote}`, created > 0 ? "success" : "error");
    }
  };

  // ── Inline stock save ────────────────────────────────────────────────
  const handleStockSave = async (v: ProductVariant) => {
    const newStock = dirtyStock[v.id];
    if (newStock === undefined || newStock === v.stockQuantity) {
      setDirtyStock((p) => { const n = { ...p }; delete n[v.id]; return n; });
      return;
    }
    setSavingStock((p) => new Set([...p, v.id]));
    try {
      await Mutations.variants.update(v.id, { ...v, stockQuantity: newStock });
      await refetch();
      setDirtyStock((p) => { const n = { ...p }; delete n[v.id]; return n; });
      showToast("Đã cập nhật tồn kho.");
    } catch (e: any) {
      showToast(e?.message || "Lỗi cập nhật tồn kho.", "error");
    } finally {
      setSavingStock((p) => { const n = new Set(p); n.delete(v.id); return n; });
    }
  };

  // ── Toggle active (inline) ────────────────────────────────────────────
  const handleToggleActive = async (v: ProductVariant) => {
    try {
      await Mutations.variants.update(v.id, { ...v, active: !v.active });
      await refetch();
    } catch (e: any) {
      showToast(e?.message || "Lỗi cập nhật trạng thái.", "error");
    }
  };

  // ── Dialog save ───────────────────────────────────────────────────────
  const handleDialogSave = async () => {
    setSaving(true);
    try {
      if (dialog.editing) {
        await Mutations.variants.update(dialog.editing.id, form);
      } else {
        await Mutations.variants.create(productId, form);
      }
      await refetch();
      setDialog({ open: false, editing: null });
      showToast(dialog.editing ? "Đã cập nhật biến thể." : "Đã thêm biến thể.");
    } catch (e: any) {
      showToast(e?.message || "Lỗi lưu biến thể.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await Mutations.variants.delete(deleteId);
      await refetch();
      showToast("Đã xoá biến thể.");
    } catch (e: any) {
      showToast(e?.message || "Lỗi xoá biến thể.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h6" fontWeight={700}>
        Bước 5: Quản lý biến thể sản phẩm
      </Typography>

      {/* ── BATCH GENERATOR ────────────────────────────────────────── */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} mb={2} color="primary">
          ⚡ Tạo nhanh biến thể
        </Typography>

        {/* Kích cỡ */}
        <Box mb={2.5}>
          <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">
            Kích cỡ
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75} mb={1}>
            {PRESET_SIZES.map((s) => (
              <Chip
                key={s} label={s} size="small"
                variant={selectedSizes.includes(s) ? "filled" : "outlined"}
                color={selectedSizes.includes(s) ? "warning" : "default"}
                onClick={() => toggleSize(s)}
                sx={{ cursor: "pointer", fontWeight: selectedSizes.includes(s) ? 700 : 400 }}
              />
            ))}
            {selectedSizes
              .filter((s) => !PRESET_SIZES.includes(s))
              .map((s) => (
                <Chip
                  key={s} label={s} size="small"
                  variant="filled" color="warning"
                  onDelete={() => setSelectedSizes((p) => p.filter((x) => x !== s))}
                  sx={{ fontWeight: 700 }}
                />
              ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ maxWidth: 300 }}>
            <TextField
              size="small" placeholder="Thêm kích cỡ tuỳ chỉnh..."
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSize(); } }}
              sx={{ flex: 1 }}
            />
            <Button size="small" variant="outlined" onClick={addCustomSize} disabled={!customSize.trim()}>
              Thêm
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Màu sắc */}
        <Box mb={2.5}>
          <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">
            Màu sắc
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} mb={1.5} alignItems="center">
            {PRESET_COLORS.map((c) => (
              <AdminColorSwatch
                key={c.name} name={c.name}
                selected={selectedColors.includes(c.name)}
                onClick={() => toggleColor(c.name)}
              />
            ))}
            {selectedColors
              .filter((c) => !PRESET_COLORS.some((p) => p.name === c))
              .map((c) => {
                const hex = getColorHex(c);
                return (
                  <Tooltip key={c} title={c} arrow>
                    <Chip
                      label={c} size="small"
                      variant="filled" color="warning"
                      onDelete={() => setSelectedColors((p) => p.filter((x) => x !== c))}
                      sx={{ fontWeight: 700 }}
                      icon={hex ? (
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: hex, ml: 0.5 }} />
                      ) : undefined}
                    />
                  </Tooltip>
                );
              })}
          </Stack>
          {/* Selected colors label */}
          {selectedColors.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.5} mb={1}>
              {selectedColors.map((c) => (
                <Chip
                  key={c} label={c} size="small"
                  variant="outlined" color="warning"
                  onDelete={() => setSelectedColors((p) => p.filter((x) => x !== c))}
                />
              ))}
            </Stack>
          )}
          <Stack direction="row" spacing={1} sx={{ maxWidth: 300 }}>
            <TextField
              size="small" placeholder="Thêm màu tuỳ chỉnh..."
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomColor(); } }}
              sx={{ flex: 1 }}
            />
            <Button size="small" variant="outlined" onClick={addCustomColor} disabled={!customColor.trim()}>
              Thêm
            </Button>
          </Stack>
        </Box>

        {/* Nút tạo tổ hợp */}
        {(selectedSizes.length > 0 || selectedColors.length > 0) && (
          <Box>
            {newCombos.length === 0 ? (
              <Alert severity="info" sx={{ py: 0.5 }}>
                Tất cả tổ hợp đã tồn tại.
              </Alert>
            ) : (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <BoltIcon />}
                  onClick={handleGenerate}
                  disabled={generating}
                  sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" }, fontWeight: 700 }}
                >
                  {generating
                    ? `Đang tạo ${genProgress.done}/${genProgress.total}...`
                    : `Tạo ${newCombos.length} biến thể`}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {selectedSizes.length > 0 && selectedColors.length > 0
                    ? `${selectedSizes.length} kích cỡ × ${selectedColors.length} màu`
                    : selectedSizes.length > 0
                    ? `${selectedSizes.length} kích cỡ`
                    : `${selectedColors.length} màu`}
                </Typography>
              </Stack>
            )}
            {generating && (
              <LinearProgress
                variant="determinate"
                value={genProgress.total > 0 ? (genProgress.done / genProgress.total) * 100 : 0}
                sx={{ mt: 1.5, borderRadius: 2 }}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* ── BẢNG BIẾN THỂ ────────────────────────────────────────────── */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="subtitle1" fontWeight={700}>
            Danh sách biến thể
            {variants.length > 0 && (
              <Typography component="span" variant="body2" color="text.secondary" ml={1}>
                ({variants.length} biến thể)
              </Typography>
            )}
          </Typography>
          <Button
            size="small" variant="outlined" startIcon={<AddIcon />}
            onClick={() => { setForm(EMPTY); setDialog({ open: true, editing: null }); }}
          >
            Thêm 1 biến thể
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : variants.length === 0 ? (
          <Paper variant="outlined" sx={{ py: 5, textAlign: "center", borderRadius: 2 }}>
            <Typography color="text.secondary" mb={1}>
              Chưa có biến thể nào.
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Dùng trình tạo nhanh phía trên hoặc nhấn "Thêm 1 biến thể".
            </Typography>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Kích cỡ</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Màu sắc</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, minWidth: 120 }}>
                    Tồn kho
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Giá riêng (₫)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Bán</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((v) => {
                  const stockVal = dirtyStock[v.id] ?? v.stockQuantity;
                  const isDirty = dirtyStock[v.id] !== undefined && dirtyStock[v.id] !== v.stockQuantity;
                  const isSaving = savingStock.has(v.id);
                  return (
                    <TableRow
                      key={v.id}
                      sx={{ "&:hover": { bgcolor: "action.hover" }, opacity: v.active ? 1 : 0.55 }}
                    >
                      <TableCell>
                        {v.size ? (
                          <Chip label={v.size} size="small" variant="outlined" />
                        ) : (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <ColorCell color={v.color} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={v.sku ? "text.primary" : "text.disabled"}>
                          {v.sku || "—"}
                        </Typography>
                      </TableCell>
                      {/* Inline stock edit */}
                      <TableCell align="right">
                        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                          <TextField
                            size="small" type="number"
                            value={stockVal}
                            onChange={(e) => setDirtyStock((p) => ({ ...p, [v.id]: Math.max(0, Number(e.target.value)) }))}
                            onBlur={() => handleStockSave(v)}
                            disabled={isSaving}
                            sx={{ width: 80, "& input": { textAlign: "right", py: 0.5, px: 1, fontSize: 13 } }}
                          />
                          {isDirty && !isSaving && (
                            <Tooltip title="Lưu tồn kho" arrow>
                              <IconButton size="small" color="success" onClick={() => handleStockSave(v)}>
                                <CheckIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {isSaving && <CircularProgress size={14} />}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {v.priceOverride ? v.priceOverride.toLocaleString("vi-VN") : (
                            <Typography component="span" variant="body2" color="text.disabled">Theo SP</Typography>
                          )}
                        </Typography>
                      </TableCell>
                      {/* Inline active toggle */}
                      <TableCell align="center">
                        <Switch
                          size="small"
                          checked={v.active}
                          onChange={() => handleToggleActive(v)}
                          color="success"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Sửa" arrow>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setForm({ size: v.size, color: v.color, sku: v.sku, stockQuantity: v.stockQuantity, priceOverride: v.priceOverride, active: v.active });
                              setDialog({ open: true, editing: v });
                            }}
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xoá" arrow>
                          <IconButton size="small" color="error" onClick={() => setDeleteId(v.id)}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      {/* ── Nút điều hướng ────────────────────────────────────────────── */}
      <Box display="flex" justifyContent={onBack ? "space-between" : "flex-end"} alignItems="center" mt={1}>
        {onBack && (
          <Button variant="outlined" onClick={onBack}>Quay lại</Button>
        )}
        <Box display="flex" gap={1.5}>
          {onSkip && skipLabel && (
            <Button variant="text" color="inherit" onClick={onSkip} sx={{ color: "text.secondary" }}>
              {skipLabel}
            </Button>
          )}
          {onDone && (
            <Button variant="contained" color="success" onClick={onDone}>
              Hoàn tất
            </Button>
          )}
        </Box>
      </Box>

      {/* ── Dialog tạo / sửa 1 biến thể ─────────────────────────────── */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, editing: null })}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialog.editing ? "Sửa biến thể" : "Thêm 1 biến thể"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Kích cỡ"
                placeholder="VD: S, M, L, 40..."
                value={form.size ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, size: e.target.value || null }))}
                fullWidth
              />
              <TextField
                label="Màu sắc"
                placeholder="VD: Đỏ, Xanh Navy..."
                value={form.color ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, color: e.target.value || null }))}
                fullWidth
                InputProps={form.color ? {
                  startAdornment: (() => {
                    const hex = getColorHex(form.color);
                    return hex ? (
                      <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: hex, mr: 0.5, border: "1px solid rgba(0,0,0,0.15)", flexShrink: 0 }} />
                    ) : null;
                  })(),
                } : undefined}
              />
            </Stack>
            <TextField
              label="SKU (mã nội bộ, tuỳ chọn)"
              value={form.sku ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value || null }))}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Tồn kho"
                type="number"
                value={form.stockQuantity}
                onChange={(e) => setForm((p) => ({ ...p, stockQuantity: Math.max(0, Number(e.target.value)) }))}
                fullWidth
              />
              <TextField
                label="Giá riêng (₫) — để trống = theo SP"
                type="number"
                value={form.priceOverride ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, priceOverride: e.target.value === "" ? null : Number(e.target.value) }))}
                fullWidth
              />
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  color="success"
                />
              }
              label={form.active ? "Đang bán" : "Ngừng bán"}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog({ open: false, editing: null })} variant="outlined">
            Huỷ
          </Button>
          <Button variant="contained" onClick={handleDialogSave} disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog xác nhận xoá ──────────────────────────────────────── */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận xoá biến thể</DialogTitle>
        <DialogContent>
          <Typography>Biến thể này sẽ bị xoá vĩnh viễn. Bạn chắc chắn?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined">Huỷ</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Xoá</Button>
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
