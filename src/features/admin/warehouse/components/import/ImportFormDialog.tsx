"use client";

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, Box, Typography,
  IconButton, Stack, Autocomplete, Divider, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useToast } from "@/lib/toast/ToastContext";
import { useWarehouses, useCreateImport, useConfirmImport } from "../../queries";
import type { StockImportItemRequest, StockImportRequest } from "../../types";
import { api } from "@/lib/api/http";

interface ProductOption {
  id: number;
  name: string;
  costPrice: number;
  imageAvt?: string;
  variants: { id: number; size: string | null; color: string | null; stockQuantity: number }[];
}

interface CartRow extends StockImportItemRequest {
  _key: number;
  productName: string;
  variantDesc: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

let _key = 0;

export default function ImportFormDialog({ open, onClose }: Props) {
  const { data: warehouses = [] } = useWarehouses();
  const createImport = useCreateImport();
  const confirmImport = useConfirmImport();
  const { showToast } = useToast();

  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [rows, setRows] = useState<CartRow[]>([]);

  // product search
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [addQty, setAddQty] = useState(1);
  const [addCost, setAddCost] = useState(0);

  useEffect(() => {
    if (!open) {
      setWarehouseId("");
      setNote("");
      setRows([]);
      setSearchInput("");
      setSelectedProduct(null);
      setSelectedVariantId(null);
      setAddQty(1);
      setAddCost(0);
    }
  }, [open]);

  // Debounce product search
  useEffect(() => {
    if (searchInput.length < 2) { setProductOptions([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get<any>("/api/v1/products", {
          params: { search: searchInput, page: 1, size: 10 },
        });
        const list = res?.result ?? res ?? [];
        setProductOptions(Array.isArray(list) ? list : []);
      } catch { setProductOptions([]); }
      finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSelectProduct = (p: ProductOption | null) => {
    setSelectedProduct(p);
    setSelectedVariantId(null);
    setAddCost(p?.costPrice ?? 0);
  };

  const handleAddRow = () => {
    if (!selectedProduct) return;
    const variant = selectedProduct.variants?.find((v) => v.id === selectedVariantId) ?? null;
    const variantDesc = variant
      ? [variant.size && `Size ${variant.size}`, variant.color].filter(Boolean).join(" - ")
      : null;

    setRows((prev) => [
      ...prev,
      {
        _key: ++_key,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        variantId: selectedVariantId,
        variantDesc: variantDesc || null,
        quantity: addQty,
        costPrice: addCost,
      },
    ]);

    // Reset add form
    setSelectedProduct(null);
    setSearchInput("");
    setSelectedVariantId(null);
    setAddQty(1);
    setAddCost(0);
  };

  const removeRow = (key: number) => setRows((p) => p.filter((r) => r._key !== key));

  const updateRow = (key: number, field: "quantity" | "costPrice", val: number) =>
    setRows((p) => p.map((r) => (r._key === key ? { ...r, [field]: val } : r)));

  const totalCost = rows.reduce((s, r) => s + r.quantity * r.costPrice, 0);

  const buildRequest = (): StockImportRequest => ({
    warehouseId: warehouseId as number,
    note: note || undefined,
    items: rows.map((r) => ({
      productId: r.productId,
      variantId: r.variantId,
      quantity: r.quantity,
      costPrice: r.costPrice,
    })),
  });

  const handleSaveDraft = async () => {
    if (!warehouseId || rows.length === 0) {
      showToast("Vui lòng chọn kho và thêm ít nhất 1 sản phẩm", "error");
      return;
    }
    try {
      await createImport.mutateAsync(buildRequest());
      showToast("Đã lưu phiếu nhập nháp", "success");
      onClose();
    } catch (e: any) {
      showToast(e?.message ?? "Lỗi tạo phiếu nhập", "error");
    }
  };

  const handleConfirm = async () => {
    if (!warehouseId || rows.length === 0) {
      showToast("Vui lòng chọn kho và thêm ít nhất 1 sản phẩm", "error");
      return;
    }
    try {
      const draft = await createImport.mutateAsync(buildRequest());
      await confirmImport.mutateAsync(draft.id);
      showToast(`Nhập kho thành công: ${draft.importCode}`, "success");
      onClose();
    } catch (e: any) {
      showToast(e?.message ?? "Lỗi xác nhận nhập kho", "error");
    }
  };

  const isBusy = createImport.isPending || confirmImport.isPending;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle>Tạo phiếu nhập hàng</DialogTitle>

      <DialogContent dividers>
        {/* Header: kho + ghi chú */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <TextField
            select fullWidth label="Kho nhập *"
            value={warehouseId}
            onChange={(e) => setWarehouseId(Number(e.target.value))}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            {warehouses
              .filter((w) => w.isActive)
              .map((w) => (
                <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
              ))}
          </TextField>
          <TextField
            fullWidth label="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Search + add row */}
        <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Thêm sản phẩm</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mb={2} alignItems="flex-end">
          <Autocomplete
            sx={{ minWidth: 260 }}
            options={productOptions}
            getOptionLabel={(o) => o.name}
            inputValue={searchInput}
            onInputChange={(_, v) => setSearchInput(v)}
            onChange={(_, v) => handleSelectProduct(v)}
            value={selectedProduct}
            loading={searching}
            noOptionsText="Nhập tên sản phẩm để tìm kiếm"
            renderInput={(params) => (
              <TextField {...params} label="Tìm sản phẩm *" size="small"
                InputProps={{ ...params.InputProps,
                  endAdornment: (<>{searching && <CircularProgress size={16} />}{params.InputProps.endAdornment}</>)
                }} />
            )}
          />

          {selectedProduct && selectedProduct.variants?.length > 0 && (
            <TextField
              select size="small" label="Variant" sx={{ minWidth: 160 }}
              value={selectedVariantId ?? ""}
              onChange={(e) => setSelectedVariantId(e.target.value ? Number(e.target.value) : null)}
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
              {selectedProduct.variants.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {[v.size && `Size ${v.size}`, v.color].filter(Boolean).join(" - ")}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            size="small" label="Số lượng" type="number" sx={{ width: 100 }}
            value={addQty}
            onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
          />
          <TextField
            size="small" label="Giá nhập (₫)" type="number" sx={{ width: 140 }}
            value={addCost}
            onChange={(e) => setAddCost(Math.max(0, parseInt(e.target.value) || 0))}
            inputProps={{ min: 0 }}
          />
          <Button
            variant="outlined" startIcon={<AddIcon />}
            onClick={handleAddRow}
            disabled={!selectedProduct}
          >
            Thêm
          </Button>
        </Stack>

        {/* Items table */}
        {rows.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Variant</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 100 }}>Số lượng</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 140 }}>Giá nhập (₫)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Thành tiền</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r._key}>
                    <TableCell>{r.productName}</TableCell>
                    <TableCell>{r.variantDesc ?? "—"}</TableCell>
                    <TableCell>
                      <TextField
                        size="small" type="number" value={r.quantity}
                        onChange={(e) => updateRow(r._key, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                        inputProps={{ min: 1, style: { width: 60 } }}
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small" type="number" value={r.costPrice}
                        onChange={(e) => updateRow(r._key, "costPrice", Math.max(0, parseInt(e.target.value) || 0))}
                        inputProps={{ min: 0, style: { width: 110 } }}
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {(r.quantity * r.costPrice).toLocaleString("vi-VN")}₫
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => removeRow(r._key)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {rows.length > 0 && (
          <Box sx={{ textAlign: "right", mt: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Tổng tiền: {totalCost.toLocaleString("vi-VN")}₫
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} disabled={isBusy}>Huỷ</Button>
        <Button
          variant="outlined"
          onClick={handleSaveDraft}
          disabled={isBusy || !warehouseId || rows.length === 0}
        >
          {isBusy ? "Đang lưu..." : "Lưu nháp"}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={isBusy || !warehouseId || rows.length === 0}
        >
          {isBusy ? "Đang xử lý..." : "Xác nhận nhập kho"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
