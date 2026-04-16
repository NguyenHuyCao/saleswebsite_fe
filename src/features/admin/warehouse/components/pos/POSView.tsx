"use client";

import {
  Autocomplete, Box, Button, Chip, CircularProgress, Divider,
  IconButton, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import DeleteIcon         from "@mui/icons-material/Delete";
import AddIcon            from "@mui/icons-material/Add";
import RemoveIcon         from "@mui/icons-material/Remove";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteSweepIcon    from "@mui/icons-material/DeleteSweep";
import StorefrontIcon     from "@mui/icons-material/Storefront";
import PersonIcon         from "@mui/icons-material/Person";
import ReceiptLongIcon    from "@mui/icons-material/ReceiptLong";

import { useState, useEffect, useRef } from "react";
import { useToast }           from "@/lib/toast/ToastContext";
import { useWarehouses, useCreateStoreOrder } from "../../queries";
import type { StoreOrderRequest, StoreOrder } from "../../types";
import { api }                from "@/lib/api/http";
import SuccessModal           from "./SuccessModal";
import InvoiceTemplate        from "./InvoiceTemplate";

// ── Constants ────────────────────────────────────────────────────────────────
const GOLD = "#FFB300";
const vnd  = (n: number) => n.toLocaleString("vi-VN") + "đ";

const PM_METHODS = ["CASH", "TRANSFER", "CARD"] as const;
const PM_LABEL: Record<string, string> = {
  CASH: "💵 Tiền mặt",
  TRANSFER: "🏦 Chuyển khoản",
  CARD: "💳 Thẻ",
};

// ── Types ────────────────────────────────────────────────────────────────────
interface ProductOption {
  id: number;
  name: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  imageAvt: string | null;
  variants: { id: number; size: string | null; color: string | null; stockQuantity: number }[];
}

interface CartItem {
  _key:            number;
  productId:       number;
  variantId:       number | null;
  productNameSnap: string;
  variantSnap:     string | null;
  imageAvt:        string | null;
  quantity:        number;
  unitPrice:       number;
  costPrice:       number;
  discountAmount:  number;
}

let _key = 0;

// ── Component ─────────────────────────────────────────────────────────────────
export default function POSView() {
  const { showToast }     = useToast();
  const { data: warehouses = [] } = useWarehouses();
  const createOrder       = useCreateStoreOrder();

  // Warehouses
  const storeWarehouses   = warehouses.filter((w) => w.isActive && w.type === "STORE");
  const singleStore       = storeWarehouses.length === 1 ? storeWarehouses[0] : null;

  // ── Form state ───────────────────────────────────────────────────────────
  const [warehouseId,          setWarehouseId]          = useState<number | "">("");
  const [customerName,         setCustomerName]         = useState("");
  const [customerPhone,        setCustomerPhone]        = useState("");
  const [paymentMethod,        setPaymentMethod]        = useState<"CASH" | "TRANSFER" | "CARD">("CASH");
  const [discountType,         setDiscountType]         = useState<"vnd" | "pct">("vnd");
  const [discountValue,        setDiscountValue]        = useState(0);
  const [amountPaid,           setAmountPaid]           = useState(0);
  const [isPaidManuallyEdited, setIsPaidManuallyEdited] = useState(false);
  const [note,                 setNote]                 = useState("");
  const [successOrder,         setSuccessOrder]         = useState<StoreOrder | null>(null);

  // ── Product search ───────────────────────────────────────────────────────
  const [productOptions,  setProductOptions]  = useState<ProductOption[]>([]);
  const [searchInput,     setSearchInput]     = useState("");
  const [searching,       setSearching]       = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [addQty,          setAddQty]          = useState(1);

  // ── Cart ─────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const searchRef   = useRef<HTMLInputElement>(null);
  const submitRef   = useRef<() => void>(() => {});

  // ── Auto-select single store ──────────────────────────────────────────────
  useEffect(() => {
    if (singleStore) setWarehouseId(singleStore.id);
  }, [singleStore?.id]);

  // ── Product search debounce ───────────────────────────────────────────────
  useEffect(() => {
    if (searchInput.length < 2) { setProductOptions([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get<any>("/api/v1/products", {
          params: { search: searchInput, page: 1, size: 10 },
        });
        const list = res?.result ?? res ?? [];
        const normalized = (Array.isArray(list) ? list : []).map((p: any) => ({
          ...p,
          variants: Array.isArray(p.variants) ? p.variants : [],
        }));
        setProductOptions(normalized);
      } catch { setProductOptions([]); }
      finally  { setSearching(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Computed values ───────────────────────────────────────────────────────
  const subtotal = cart.reduce((s, c) => s + c.quantity * c.unitPrice, 0);
  const discountAmount = discountType === "pct"
    ? Math.min(Math.floor(subtotal * Math.max(0, Math.min(100, discountValue)) / 100), subtotal)
    : Math.min(discountValue, subtotal);
  const totalAmount  = Math.max(0, subtotal - discountAmount);
  const change       = Math.max(0, amountPaid - totalAmount);
  const isShortPaid  = paymentMethod === "CASH" && amountPaid < totalAmount;
  const totalItems   = cart.reduce((s, c) => s + c.quantity, 0);

  // ── Auto-fill tiền nhận ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isPaidManuallyEdited) setAmountPaid(totalAmount);
  }, [totalAmount, isPaidManuallyEdited]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.key === "F10" || (e.ctrlKey && e.key === "Enter")) && !e.repeat) {
        e.preventDefault();
        submitRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    // Require variant selection if product has variants
    if (selectedProduct.variants.length > 0 && selectedVariantId == null) {
      showToast("Vui lòng chọn biến thể", "error");
      return;
    }
    const variant = selectedProduct.variants.find((v) => v.id === selectedVariantId) ?? null;
    const variantSnap = variant
      ? [variant.size && `Size ${variant.size}`, variant.color].filter(Boolean).join(" - ") || null
      : null;

    const existing = cart.find(
      (c) => c.productId === selectedProduct.id && c.variantId === (selectedVariantId ?? null)
    );
    if (existing) {
      setCart((p) => p.map((c) =>
        c._key === existing._key ? { ...c, quantity: c.quantity + addQty } : c
      ));
    } else {
      setCart((p) => [...p, {
        _key:            ++_key,
        productId:       selectedProduct.id,
        variantId:       selectedVariantId,
        productNameSnap: selectedProduct.name,
        variantSnap,
        imageAvt:        selectedProduct.imageAvt ?? null,
        quantity:        addQty,
        unitPrice:       selectedProduct.price,
        costPrice:       selectedProduct.costPrice ?? 0,
        discountAmount:  0,
      }]);
    }
    setSelectedProduct(null);
    setSearchInput("");
    setSelectedVariantId(null);
    setAddQty(1);
  };

  const removeItem       = (k: number) => setCart((p) => p.filter((c) => c._key !== k));
  const clearCart        = ()          => setCart([]);
  const updateQty        = (k: number, qty: number) =>
    setCart((p) => p.map((c) => c._key === k ? { ...c, quantity: Math.max(1, qty) } : c));
  const updatePrice      = (k: number, price: number) =>
    setCart((p) => p.map((c) => c._key === k ? { ...c, unitPrice: Math.max(0, price) } : c));
  const updateLineDisc   = (k: number, v: number) =>
    setCart((p) => p.map((c) => c._key === k ? { ...c, discountAmount: Math.max(0, v) } : c));

  const resetForm = () => {
    setCart([]);
    setDiscountValue(0);
    setAmountPaid(0);
    setIsPaidManuallyEdited(false);
    setCustomerName("");
    setCustomerPhone("");
    setNote("");
    setPaymentMethod("CASH");
    setDiscountType("vnd");
  };

  const handleSubmit = async () => {
    if (!warehouseId)   { showToast("Vui lòng chọn kho", "error");    return; }
    if (cart.length === 0) { showToast("Giỏ hàng trống", "error");    return; }
    if (isShortPaid)    { showToast("Tiền nhận chưa đủ", "error");    return; }

    const req: StoreOrderRequest = {
      warehouseId:   warehouseId as number,
      customerName:  customerName  || undefined,
      customerPhone: customerPhone || undefined,
      discountAmount,
      paymentMethod,
      amountPaid,
      note: note || undefined,
      items: cart.map(({ _key: _k, imageAvt: _img, ...item }) => item),
    };
    try {
      const order = await createOrder.mutateAsync(req);
      setSuccessOrder(order);
    } catch (e: any) {
      showToast(e?.message ?? "Lỗi tạo đơn hàng", "error");
    }
  };

  // Keep submitRef always up-to-date (avoid stale closure in keyboard handler)
  submitRef.current = handleSubmit;

  const handlePrint = () => {
    const el = document.getElementById("invoice-print-area");
    if (!el) return;
    const w = window.open("", "_blank", "width=700,height=900");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="vi"><head>
      <meta charset="utf-8">
      <title>Hóa đơn ${successOrder?.orderCode ?? ""}</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:12px;color:#000;margin:0;padding:16px}
        @media print{@page{size:A4;margin:1cm}body{padding:0}}
      </style>
    </head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); w.close(); }, 400);
  };

  // ── Disable reason ────────────────────────────────────────────────────────
  const disableReason = !warehouseId      ? "Chưa chọn kho"
    : cart.length === 0                   ? "Giỏ hàng trống"
    : isShortPaid                         ? `Còn thiếu ${vnd(totalAmount - amountPaid)}`
    : "";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{
      display: "flex",
      height: "calc(100dvh - 185px)",
      minHeight: 420,
      overflow: "hidden",
      bgcolor: "background.default",
    }}>

      {/* ════════════════════════════ LEFT 65% — CART ════════════════════════════ */}
      <Box sx={{
        width: { xs: "100%", sm: "60%", md: "65%" },
        display: "flex", flexDirection: "column", height: "100%",
        borderRight: 1, borderColor: "divider",
      }}>

        {/* ── Toolbar ── */}
        <Box sx={{
          px: 1.5, py: 1, flexShrink: 0,
          borderBottom: 1, borderColor: "divider",
          bgcolor: "background.paper",
        }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>

            {/* Warehouse badge */}
            {singleStore ? (
              <Chip
                icon={<StorefrontIcon sx={{ fontSize: 14 }} />}
                label={singleStore.name}
                size="small"
                sx={{ bgcolor: GOLD, color: "#000", fontWeight: 700, flexShrink: 0,
                      "& .MuiChip-icon": { color: "#000" } }}
              />
            ) : (
              <TextField
                select size="small" label="Kho *" sx={{ minWidth: 150, flexShrink: 0 }}
                value={warehouseId}
                onChange={(e) => setWarehouseId(Number(e.target.value))}
                SelectProps={{ native: true }}
              >
                <option value="" disabled />
                {storeWarehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </TextField>
            )}

            {/* Product search — 60% of remaining width */}
            <Autocomplete
              sx={{ flex: "1 1 220px" }}
              options={productOptions}
              getOptionLabel={(o) => (typeof o === "string" ? o : o.name)}
              inputValue={searchInput}
              onInputChange={(_, v) => setSearchInput(v)}
              onChange={(_, v) => { setSelectedProduct(v); setSelectedVariantId(null); }}
              value={selectedProduct}
              loading={searching}
              noOptionsText={searchInput.length < 2 ? "Nhập ít nhất 2 ký tự" : "Không tìm thấy"}
              filterOptions={(x) => x}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Stack direction="row" spacing={1.5} alignItems="center" width="100%">
                    <Box
                      component="img"
                      src={option.imageAvt || "/placeholder.png"}
                      onError={(e: any) => { e.target.src = "/placeholder.png"; }}
                      sx={{ width: 32, height: 32, objectFit: "cover", borderRadius: 0.5, flexShrink: 0, bgcolor: "action.hover" }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Typography variant="body2" fontWeight={500} noWrap>{option.name}</Typography>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="caption" sx={{ color: GOLD, fontWeight: 700 }}>
                          {vnd(option.price)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Còn: {option.stockQuantity ?? 0}
                        </Typography>
                        {option.variants?.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {option.variants.length} biến thể
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params} label="Tìm sản phẩm (F2)" size="small"
                  inputRef={searchRef}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searching && <CircularProgress size={14} sx={{ mr: 0.5 }} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* Variant selector */}
            {selectedProduct && (selectedProduct.variants?.length ?? 0) > 0 && (
              <TextField
                select size="small" label="Biến thể" sx={{ minWidth: 130, flexShrink: 0 }}
                value={selectedVariantId ?? ""}
                onChange={(e) => setSelectedVariantId(e.target.value ? Number(e.target.value) : null)}
                SelectProps={{ native: true }}
              >
                <option value="">-- Chọn --</option>
                {selectedProduct.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {[v.size && `Size ${v.size}`, v.color].filter(Boolean).join(" - ")}
                    {` (${v.stockQuantity})`}
                  </option>
                ))}
              </TextField>
            )}

            {/* Qty [-][n][+] */}
            <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
              <IconButton
                size="small"
                onClick={() => setAddQty((q) => Math.max(1, q - 1))}
                sx={{ border: 1, borderColor: "divider", borderRadius: "4px 0 0 4px", p: 0.5 }}
              >
                <RemoveIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <TextField
                size="small" type="number"
                value={addQty}
                onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, style: { width: 36, textAlign: "center", padding: "5px 4px" } }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
              />
              <IconButton
                size="small"
                onClick={() => setAddQty((q) => q + 1)}
                sx={{ border: 1, borderColor: "divider", borderRadius: "0 4px 4px 0", p: 0.5 }}
              >
                <AddIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Stack>

            {/* Add button */}
            <Button
              variant="contained"
              onClick={handleAddToCart}
              disabled={!selectedProduct}
              startIcon={<AddShoppingCartIcon />}
              sx={{
                flexShrink: 0,
                bgcolor: GOLD, color: "#000", fontWeight: 700,
                "&:hover": { bgcolor: "#E0A000" },
                "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
              }}
            >
              Thêm
            </Button>
          </Stack>
        </Box>

        {/* ── Cart table (scrollable) ── */}
        <TableContainer sx={{
          flex: 1, overflow: "auto",
          "& .MuiTableCell-root": { py: 0.75, px: 1 },
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 28,  bgcolor: "background.paper", fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ width: 46,  bgcolor: "background.paper" }} />
                <TableCell sx={{             bgcolor: "background.paper", fontWeight: 700 }}>Sản phẩm</TableCell>
                <TableCell sx={{ width: 116, bgcolor: "background.paper", fontWeight: 700 }} align="center">SL</TableCell>
                <TableCell sx={{ width: 104, bgcolor: "background.paper", fontWeight: 700 }} align="right">Đơn giá</TableCell>
                <TableCell sx={{ width: 84,  bgcolor: "background.paper", fontWeight: 700 }} align="right">Giảm (đ)</TableCell>
                <TableCell sx={{ width: 108, bgcolor: "background.paper", fontWeight: 700, color: GOLD }} align="right">
                  Thành tiền
                </TableCell>
                <TableCell sx={{ width: 36,  bgcolor: "background.paper" }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Stack alignItems="center" spacing={1.5} color="text.disabled">
                      <AddShoppingCartIcon sx={{ fontSize: 48 }} />
                      <Typography variant="body2">
                        Nhấn <strong>F2</strong> để tìm và thêm sản phẩm
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
              {cart.map((item, idx) => {
                const lineTotal = Math.max(0, item.quantity * item.unitPrice - item.discountAmount);
                return (
                  <TableRow key={item._key} hover>
                    <TableCell sx={{ color: "text.disabled", fontSize: 11 }}>{idx + 1}</TableCell>

                    {/* Image */}
                    <TableCell>
                      {item.imageAvt ? (
                        <Box
                          component="img" src={item.imageAvt} alt=""
                          sx={{ width: 36, height: 36, objectFit: "cover", borderRadius: 0.5, display: "block" }}
                        />
                      ) : (
                        <Box sx={{
                          width: 36, height: 36, borderRadius: 0.5,
                          bgcolor: "action.hover", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}>
                          <ReceiptLongIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                        </Box>
                      )}
                    </TableCell>

                    {/* Name */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 180 }}>
                        {item.productNameSnap}
                      </Typography>
                      {item.variantSnap && (
                        <Typography variant="caption" color="text.secondary">{item.variantSnap}</Typography>
                      )}
                    </TableCell>

                    {/* Qty [-][n][+] */}
                    <TableCell align="center">
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.25}>
                        <IconButton size="small" sx={{ p: 0.25 }}
                          onClick={() => updateQty(item._key, item.quantity - 1)}>
                          <RemoveIcon sx={{ fontSize: 13 }} />
                        </IconButton>
                        <TextField
                          size="small" type="number" variant="standard"
                          value={item.quantity}
                          onChange={(e) => updateQty(item._key, parseInt(e.target.value) || 1)}
                          inputProps={{ min: 1, style: { width: 32, textAlign: "center", padding: "1px 0" } }}
                        />
                        <IconButton size="small" sx={{ p: 0.25 }}
                          onClick={() => updateQty(item._key, item.quantity + 1)}>
                          <AddIcon sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Stack>
                    </TableCell>

                    {/* Unit price (editable inline) */}
                    <TableCell align="right">
                      <TextField
                        size="small" type="number" variant="standard"
                        value={item.unitPrice}
                        onChange={(e) => updatePrice(item._key, parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0, style: { width: 88, textAlign: "right", padding: "1px 0" } }}
                      />
                    </TableCell>

                    {/* Per-line discount */}
                    <TableCell align="right">
                      <TextField
                        size="small" type="number" variant="standard"
                        value={item.discountAmount || ""}
                        placeholder="0"
                        onChange={(e) => updateLineDisc(item._key, parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0, style: { width: 72, textAlign: "right", padding: "1px 0" } }}
                      />
                    </TableCell>

                    {/* Line total */}
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700} sx={{ color: GOLD }}>
                        {vnd(lineTotal)}
                      </Typography>
                    </TableCell>

                    {/* Delete */}
                    <TableCell>
                      <IconButton size="small" color="error" sx={{ p: 0.5 }}
                        onClick={() => removeItem(item._key)}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Cart footer ── */}
        <Box sx={{
          px: 1.5, py: 1, flexShrink: 0,
          borderTop: 1, borderColor: "divider",
          bgcolor: "background.paper",
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {cart.length} loại &nbsp;·&nbsp; {totalItems} items
            </Typography>
            {cart.length > 0 && (
              <Button
                size="small" color="error" variant="text"
                startIcon={<DeleteSweepIcon sx={{ fontSize: 14 }} />}
                onClick={clearCart}
                sx={{ fontSize: 11, py: 0.25, minWidth: 0 }}
              >
                Xóa tất cả
              </Button>
            )}
          </Stack>
          <Stack direction="row" justifyContent="flex-end" mt={0.5}>
            <Typography variant="body2" color="text.secondary">
              Tạm tính:&nbsp;
              <Typography component="span" variant="body2" fontWeight={700} color="text.primary">
                {vnd(subtotal)}
              </Typography>
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* ════════════════════════════ RIGHT 35% — PAYMENT ════════════════════════ */}
      <Box sx={{
        width: { xs: "100%", sm: "40%", md: "35%" },
        display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
      }}>

        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflow: "auto", px: 2, pt: 1.5 }}>
          <Stack spacing={1.5}>

            {/* ── Section 1: Khách hàng ── */}
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                <PersonIcon sx={{ fontSize: 13 }} /> Khách hàng
              </Typography>
              <Stack spacing={1}>
                <TextField size="small" label="Tên khách hàng" fullWidth
                  placeholder="Khách vãng lai"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <TextField size="small" label="Số điện thoại" fullWidth
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </Stack>
            </Box>

            <Divider />

            {/* ── Section 2: Phương thức thanh toán ── */}
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.8, mb: 1, display: "block" }}>
                Phương thức thanh toán
              </Typography>
              <Stack direction="row" spacing={0.75}>
                {PM_METHODS.map((pm) => (
                  <Button
                    key={pm} fullWidth size="small"
                    variant={paymentMethod === pm ? "contained" : "outlined"}
                    onClick={() => setPaymentMethod(pm)}
                    sx={paymentMethod === pm
                      ? { bgcolor: GOLD, color: "#000", fontWeight: 700, borderColor: GOLD,
                          fontSize: 11, py: 0.75, "&:hover": { bgcolor: "#E0A000" } }
                      : { borderColor: "divider", color: "text.secondary", fontSize: 11, py: 0.75 }
                    }
                  >
                    {PM_LABEL[pm]}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* ── Section 3: Tổng kết ── */}
            <Box>
              {/* Subtotal */}
              <Stack direction="row" justifyContent="space-between" mb={0.75}>
                <Typography variant="body2" color="text.secondary">Tạm tính</Typography>
                <Typography variant="body2">{vnd(subtotal)}</Typography>
              </Stack>

              {/* Discount row */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                <Typography variant="body2" color="text.secondary">Giảm giá</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TextField
                    size="small" type="number"
                    value={discountValue || ""}
                    placeholder="0"
                    onChange={(e) => setDiscountValue(Math.max(0, parseInt(e.target.value) || 0))}
                    inputProps={{ min: 0, style: { width: 84, textAlign: "right", padding: "4px 8px" } }}
                    sx={{ "& .MuiInputBase-root": { height: 30 } }}
                  />
                  {/* % / đ toggle */}
                  <Stack direction="row" sx={{
                    border: 1, borderColor: "divider",
                    borderRadius: 1, overflow: "hidden",
                  }}>
                    {(["vnd", "pct"] as const).map((t) => (
                      <Box
                        key={t}
                        onClick={() => setDiscountType(t)}
                        sx={{
                          px: 0.875, py: 0.375, cursor: "pointer",
                          fontSize: 12, fontWeight: discountType === t ? 700 : 400,
                          bgcolor: discountType === t ? GOLD : "transparent",
                          color:   discountType === t ? "#000" : "text.secondary",
                          userSelect: "none", transition: "all .15s",
                          lineHeight: 1.4,
                        }}
                      >
                        {t === "vnd" ? "đ" : "%"}
                      </Box>
                    ))}
                  </Stack>
                  {discountAmount > 0 && (
                    <Typography variant="caption" color="error.main" sx={{ whiteSpace: "nowrap" }}>
                      -{vnd(discountAmount)}
                    </Typography>
                  )}
                </Stack>
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* Total */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight={800}>TỔNG CỘNG</Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: GOLD }}>
                  {vnd(totalAmount)}
                </Typography>
              </Stack>

              {/* CASH: tiền nhận + tiền thừa */}
              {paymentMethod === "CASH" && (
                <Box mt={1.5} p={1.25}
                  sx={{ bgcolor: "action.hover", borderRadius: 1, border: 1, borderColor: "divider" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                    <Typography variant="body2" color={isShortPaid ? "error.main" : "text.secondary"}>
                      Tiền nhận
                    </Typography>
                    <TextField
                      size="small" type="number"
                      value={amountPaid || ""}
                      placeholder="0"
                      error={isShortPaid}
                      onChange={(e) => {
                        setIsPaidManuallyEdited(true);
                        setAmountPaid(Math.max(0, parseInt(e.target.value) || 0));
                      }}
                      onFocus={() => setIsPaidManuallyEdited(true)}
                      inputProps={{ min: 0, style: { width: 112, textAlign: "right" } }}
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Tiền thừa</Typography>
                    <Typography
                      variant="body2" fontWeight={700}
                      color={change > 0 ? "success.main" : isShortPaid ? "error.main" : "text.secondary"}
                    >
                      {vnd(change)}
                    </Typography>
                  </Stack>
                </Box>
              )}

              {/* TRANSFER: số tiền cần chuyển */}
              {paymentMethod === "TRANSFER" && (
                <Box mt={1.5} p={1.25}
                  sx={{ bgcolor: "action.hover", borderRadius: 1, border: 1, borderColor: "divider" }}>
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.25}>
                    Số tiền cần chuyển khoản
                  </Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ color: GOLD }}>{vnd(totalAmount)}</Typography>
                  <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
                    Xem thông tin tài khoản tại Cấu hình → Thanh toán
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider />

            {/* ── Section 4: Ghi chú ── */}
            <TextField
              size="small" label="Ghi chú" multiline rows={2} fullWidth
              placeholder="Ghi chú đơn hàng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

          </Stack>
        </Box>

        {/* ── Section 5: Submit (fixed at bottom) ── */}
        <Box sx={{ px: 2, pb: 2, pt: 1, flexShrink: 0, borderTop: 1, borderColor: "divider" }}>
          <Tooltip title={disableReason} disableHoverListener={!disableReason} placement="top">
            <span style={{ display: "block" }}>
              <Button
                variant="contained" fullWidth
                onClick={handleSubmit}
                disabled={createOrder.isPending || !!disableReason}
                sx={{
                  height: 48, fontSize: 15, fontWeight: 800,
                  bgcolor: GOLD, color: "#000",
                  "&:hover": { bgcolor: "#E0A000" },
                  "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "text.disabled" },
                  letterSpacing: 0.5,
                }}
              >
                {createOrder.isPending
                  ? <CircularProgress size={20} sx={{ color: "#000" }} />
                  : "⚡ HOÀN TẤT ĐƠN HÀNG (F10)"
                }
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* ════════ DIALOGS ════════ */}
      {successOrder && (
        <>
          <SuccessModal
            order={successOrder}
            onPrint={handlePrint}
            onNewOrder={() => { resetForm(); setSuccessOrder(null); }}
            onViewDetail={() => setSuccessOrder(null)}
          />
          <InvoiceTemplate order={successOrder} />
        </>
      )}
    </Box>
  );
}
