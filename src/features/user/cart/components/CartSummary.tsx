"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Paper,
  Modal,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { mutate as swrMutate } from "swr";
import { CART_COUNT_KEY, ORDERS_COUNT_KEY } from "@/constants/apiKeys";
import type { CartItem } from "../types";
import {
  useClearCartMutation,
  usePlaceOrderMutation,
  useUserAddressQuery,
} from "../queries";
import { useToast } from "@/lib/toast/ToastContext";
import { useSocket } from "@/lib/socket/SocketContext";
import { provinceNames, getDistricts } from "../constants/vietnamAddresses";
import { api } from "@/lib/api/http";

const itemKey = (i: CartItem) =>
  i.variantId ? `${i.productId}-${i.variantId}` : String(i.productId);

type Props = {
  items: CartItem[];
  selectedKeys: Set<string>;
  onApplyVoucher: (code: string) => void;
};

type QuoteLine = {
  productId: number;
  productName: string;
  baseUnitPrice: number;
  finalUnitPrice: number;
  quantity: number;
  lineSubtotal: number;
  applied?: { name: string; discount: number; requiresCode: boolean } | null;
};

type QuoteResult = {
  lines: QuoteLine[];
  totalBase: number;
  totalDiscount: number;
  totalPayable: number;
};

export default function CartSummary({ items, selectedKeys, onApplyVoucher }: Props) {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUserId(JSON.parse(u)?.id ?? null);
    } catch {}
  }, []);

  const { data: fetchedAddress } = useUserAddressQuery(userId ?? undefined);
  const [userAddress, setUserAddress] = useState("");
  useEffect(() => {
    if (fetchedAddress) setUserAddress(fetchedAddress);
  }, [fetchedAddress]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MOMO" | "VNPAY">("COD");
  const [shippingType, setShippingType] = useState<"standard" | "express">("standard");
  const [orderNote, setOrderNote] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { showToast } = useToast();
  const qc = useQueryClient();
  const { refresh: refreshNotifications } = useSocket();
  const { mutateAsync: clearCart, isPending: clearing } = useClearCartMutation();
  const { mutateAsync: place, isPending } = usePlaceOrderMutation();

  // Only the items the user has checked
  const selectedItems = useMemo(
    () => items.filter((i) => selectedKeys.has(itemKey(i))),
    [items, selectedKeys]
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((s, it) => s + it.totalPrice, 0),
    [selectedItems]
  );
  const shippingFee = shippingType === "express" ? 30000 : 0;

  const discountedSubtotal = quoteResult ? quoteResult.totalPayable : subtotal;
  const totalDiscount = quoteResult ? quoteResult.totalDiscount : 0;
  const total = discountedSubtotal + shippingFee;

  // Reset quote only when the selected product IDs actually change
  const selectionFingerprint = useMemo(
    () => [...selectedKeys].sort().join(","),
    [selectedKeys]
  );
  const prevFingerprintRef = useRef("");
  useEffect(() => {
    const current = selectionFingerprint;
    if (current === prevFingerprintRef.current) return;
    const wasEmpty = prevFingerprintRef.current === "";
    prevFingerprintRef.current = current;
    if (!wasEmpty && appliedCode) {
      setQuoteResult(null);
      setAppliedCode(null);
      setVoucherCode("");
      setVoucherMsg({ text: "Thay đổi lựa chọn sản phẩm — vui lòng áp mã lại.", type: "info" });
      onApplyVoucher("");
    }
  }, [selectionFingerprint]);

  const handleApplyVoucher = async () => {
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    if (selectedItems.length === 0) {
      setVoucherMsg({ text: "Chưa chọn sản phẩm nào để áp mã.", type: "info" });
      return;
    }

    setQuoteLoading(true);
    setVoucherMsg(null);
    try {
      const result = await api.post<QuoteResult, any>("/api/v1/promotions/quote", {
        code,
        items: selectedItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      const appliedLines = (result.lines ?? []).filter((l: QuoteLine) => l.applied?.requiresCode);

      if (result.totalDiscount <= 0 || appliedLines.length === 0) {
        setVoucherMsg({
          text: "Mã hợp lệ nhưng không áp dụng được cho sản phẩm nào được chọn.",
          type: "info",
        });
        setAppliedCode(null);
        setQuoteResult(null);
      } else {
        setQuoteResult(result);
        setAppliedCode(code);
        setVoucherMsg({
          text: `Áp dụng thành công! Tiết kiệm ${result.totalDiscount.toLocaleString("vi-VN")}₫ cho ${appliedLines.length} sản phẩm.`,
          type: "success",
        });
        onApplyVoucher(code);
      }
    } catch (e: any) {
      setVoucherMsg({ text: e?.message || "Mã không hợp lệ hoặc đã hết hạn", type: "error" });
      setAppliedCode(null);
      setQuoteResult(null);
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedCode(null);
    setQuoteResult(null);
    setVoucherCode("");
    setVoucherMsg(null);
    onApplyVoucher("");
  };

  const handlePlaceOrder = async () => {
    if (!userAddress) {
      showToast("Vui lòng nhập địa chỉ giao hàng.", "error");
      return;
    }
    if (selectedItems.length === 0) {
      showToast("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.", "error");
      return;
    }
    try {
      const promotionMap = appliedCode
        ? Object.fromEntries(selectedItems.map((i) => [i.productId, appliedCode]))
        : {};
      const data = await place({
        shippingAddress: userAddress,
        paymentMethod,
        shippingNote: orderNote,
        shippingAmount: shippingFee,
        promotionNameByProductId: promotionMap,
        selectedItems: selectedItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId ?? null,
        })),
      });
      qc.invalidateQueries({ queryKey: ["orders", "me"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
      swrMutate(ORDERS_COUNT_KEY);
      swrMutate(CART_COUNT_KEY);
      refreshNotifications();
      showToast(
        paymentMethod === "COD"
          ? "Đơn hàng đã được đặt! Chúng tôi sẽ liên hệ xác nhận sớm nhất."
          : "Đơn hàng đã được tạo! Đang chuyển đến trang thanh toán...",
        "success",
        "Đặt hàng thành công"
      );
      setTimeout(() => {
        if (paymentMethod === "MOMO" || paymentMethod === "VNPAY") {
          // Chuyển đến trang QR thanh toán
          router.push(`/payment/${data.orderId}?method=${paymentMethod}`);
        } else {
          router.push("/order");
        }
      }, 1200);
    } catch (e: any) {
      showToast(e?.message || "Đặt hàng thất bại", "error");
    }
  };

  const handleReplaceAddress = () => {
    if (!selectedProvince || !selectedCommune || !detailAddress) return;
    const full = `${detailAddress}, ${selectedCommune}, ${selectedProvince}`;
    setUserAddress(full);
    setModalOpen(false);
    setDetailAddress("");
    setSelectedCommune("");
    setSelectedProvince("");
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      swrMutate(CART_COUNT_KEY);
      showToast("Đã xoá toàn bộ giỏ hàng.", "success", "Giỏ hàng");
      setTimeout(() => router.push("/"), 1000);
    } catch (e: any) {
      showToast(e?.message || "Xoá giỏ hàng thất bại.", "error");
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Tổng kết đơn hàng
      </Typography>

      {/* Selected item count */}
      <Typography variant="body2" color="text.secondary" mb={1}>
        {selectedItems.length} / {items.length} sản phẩm được chọn
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Thành tiền:</Typography>
        <Typography fontWeight={600}>{subtotal.toLocaleString("vi-VN")}₫</Typography>
      </Box>

      {/* Voucher */}
      <Box mb={2}>
        <Typography mb={1}>Mã giảm giá:</Typography>
        {appliedCode ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={<CheckCircleOutlineIcon />}
              label={appliedCode}
              color="success"
              onDelete={handleRemoveVoucher}
            />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              -{totalDiscount.toLocaleString("vi-VN")}₫
            </Typography>
          </Box>
        ) : (
          <Stack direction="row" spacing={1}>
            <TextField
              placeholder="Nhập mã giảm giá"
              size="small"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApplyVoucher()}
              sx={{ flex: 1 }}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
            <Button
              variant="contained"
              onClick={handleApplyVoucher}
              disabled={quoteLoading || !voucherCode.trim()}
            >
              {quoteLoading ? <CircularProgress size={18} /> : "Áp dụng"}
            </Button>
          </Stack>
        )}
        {voucherMsg && (
          <Alert severity={voucherMsg.type} sx={{ mt: 1 }} onClose={() => setVoucherMsg(null)}>
            {voucherMsg.text}
          </Alert>
        )}
      </Box>

      <Box mb={2}>
        <Typography mb={1}>Phí vận chuyển:</Typography>
        <RadioGroup
          value={shippingType}
          onChange={(e) => setShippingType(e.target.value as any)}
        >
          <FormControlLabel value="standard" control={<Radio />} label="Tiêu chuẩn (Miễn phí)" />
          <FormControlLabel value="express" control={<Radio />} label="Giao nhanh (30.000₫)" />
        </RadioGroup>
      </Box>

      <Box mb={2}>
        <Typography>Địa chỉ giao hàng:</Typography>
        <Typography variant="body2" color="text.secondary">
          {userAddress || "Chưa có địa chỉ"}
        </Typography>
        <Button size="small" sx={{ mt: 1 }} onClick={() => setModalOpen(true)}>
          Thay đổi
        </Button>
      </Box>

      <Box mb={2}>
        <Typography mb={0.5}>Phương thức thanh toán:</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as any)}
        >
          <FormControlLabel value="COD" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
          <FormControlLabel
            value="MOMO"
            control={<Radio />}
            label="Chuyển khoản MoMo (quét mã QR)"
          />
          <FormControlLabel
            value="VNPAY"
            control={<Radio />}
            label="Chuyển khoản ngân hàng (quét mã QR)"
          />
        </RadioGroup>
        {(paymentMethod === "MOMO" || paymentMethod === "VNPAY") && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            Sau khi đặt hàng, bạn sẽ được chuyển đến trang QR thanh toán. Hệ thống tự động xác nhận khi nhận được tiền.
          </Typography>
        )}
      </Box>

      <TextField
        multiline
        rows={3}
        fullWidth
        value={orderNote}
        onChange={(e) => setOrderNote(e.target.value)}
        placeholder="Ghi chú đơn hàng (nếu có)..."
        size="small"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      {totalDiscount > 0 && (
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="success.main">Tiết kiệm:</Typography>
          <Typography color="success.main" fontWeight={600}>
            -{totalDiscount.toLocaleString("vi-VN")}₫
          </Typography>
        </Box>
      )}
      {shippingFee > 0 && (
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Phí vận chuyển:</Typography>
          <Typography>{shippingFee.toLocaleString("vi-VN")}₫</Typography>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography fontWeight={600}>Tổng cộng:</Typography>
        <Typography fontWeight={700} color="primary">
          {total.toLocaleString("vi-VN")}₫
        </Typography>
      </Box>

      {selectedItems.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Vui lòng chọn ít nhất một sản phẩm để đặt hàng.
        </Alert>
      )}

      <Stack spacing={1}>
        <Button variant="outlined" color="error" onClick={handleClearCart} disabled={clearing}>
          Xoá tất cả
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          disabled={isPending || selectedItems.length === 0}
        >
          {isPending ? (
            <CircularProgress size={22} />
          ) : selectedItems.length > 0 ? (
            `Đặt hàng (${selectedItems.length} sản phẩm)`
          ) : (
            "Tiến hành đặt hàng"
          )}
        </Button>
      </Stack>

      {/* Modal cập nhật địa chỉ */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: { xs: "90%", sm: 400 },
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Cập nhật địa chỉ
          </Typography>
          <TextField
            select
            fullWidth
            label="Tỉnh"
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedCommune("");
            }}
            sx={{ mb: 2 }}
          >
            {provinceNames.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Xã/Quận"
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            disabled={!selectedProvince}
            sx={{ mb: 2 }}
          >
            {getDistricts(selectedProvince).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Địa chỉ chi tiết"
            fullWidth
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={() => setModalOpen(false)}>Huỷ</Button>
            <Button variant="contained" onClick={handleReplaceAddress}>
              Thay thế
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Paper>
  );
}
