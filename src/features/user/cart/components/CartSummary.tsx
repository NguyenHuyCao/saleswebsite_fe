"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Paper,
  Modal,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Image from "next/image";
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

type PaymentMethod = "COD" | "BANK_TRANSFER";
type ShippingType = "standard" | "express";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; desc: string }[] = [
  {
    value: "COD",
    label: "Thanh toán khi nhận hàng",
    desc: "Trả tiền mặt khi nhận hàng",
  },
  {
    value: "BANK_TRANSFER",
    label: "Chuyển khoản ngân hàng",
    desc: "MB Bank – Xác nhận trong 1–2 giờ",
  },
];

const SHIPPING_OPTIONS: { value: ShippingType; label: string; fee: number; desc: string }[] = [
  { value: "standard", label: "Tiêu chuẩn", fee: 0, desc: "3–5 ngày làm việc" },
  { value: "express", label: "Giao nhanh", fee: 30000, desc: "1–2 ngày làm việc" },
];

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [shippingType, setShippingType] = useState<ShippingType>("standard");
  const [orderNote, setOrderNote] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
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
          : "Đơn hàng đã tạo! Vui lòng chuyển khoản để hoàn tất.",
        "success",
        "Đặt hàng thành công"
      );
      setTimeout(() => {
        if (paymentMethod === "BANK_TRANSFER") {
          router.push(`/payment/${data.orderId}?method=BANK_TRANSFER`);
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
    <Paper
      id="cart-summary-anchor"
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        position: { md: "sticky" },
        top: { md: 80 },
        alignSelf: "flex-start",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 2, bgcolor: "#f25c05" }}>
        <Typography variant="h6" fontWeight={700} color="#fff">
          Tóm tắt đơn hàng
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", mt: 0.25 }}>
          {selectedItems.length}/{items.length} sản phẩm được chọn
        </Typography>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>

        {/* Address */}
        <Box mb={2.5}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.75}>
            <Box display="flex" alignItems="center" gap={0.75}>
              <LocationOnOutlinedIcon sx={{ fontSize: 18, color: "#f25c05" }} />
              <Typography fontWeight={600} fontSize={14}>
                Địa chỉ giao hàng
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />}
              onClick={() => setModalOpen(true)}
              sx={{ fontSize: 12, textTransform: "none", py: 0.25 }}
            >
              Thay đổi
            </Button>
          </Box>
          <Typography
            variant="body2"
            color={userAddress ? "text.primary" : "text.disabled"}
            sx={{
              bgcolor: "grey.50",
              borderRadius: 1,
              px: 1.5,
              py: 1,
              border: "1px solid",
              borderColor: userAddress ? "divider" : "warning.light",
            }}
          >
            {userAddress || "Chưa có địa chỉ — vui lòng cập nhật"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Shipping options */}
        <Box mb={2.5}>
          <Box display="flex" alignItems="center" gap={0.75} mb={1}>
            <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: "#f25c05" }} />
            <Typography fontWeight={600} fontSize={14}>
              Phương thức vận chuyển
            </Typography>
          </Box>
          <Stack spacing={1}>
            {SHIPPING_OPTIONS.map((opt) => (
              <Box
                key={opt.value}
                onClick={() => setShippingType(opt.value)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.25,
                  borderRadius: 1.5,
                  border: "1.5px solid",
                  borderColor: shippingType === opt.value ? "#f25c05" : "divider",
                  bgcolor: shippingType === opt.value ? "rgba(242,92,5,0.04)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Box>
                  <Typography fontSize={13} fontWeight={600}>
                    {opt.label}
                  </Typography>
                  <Typography fontSize={11} color="text.secondary">
                    {opt.desc}
                  </Typography>
                </Box>
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  color={opt.fee === 0 ? "success.main" : "text.primary"}
                >
                  {opt.fee === 0 ? "Miễn phí" : `${opt.fee.toLocaleString("vi-VN")}₫`}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Payment method */}
        <Box mb={2.5}>
          <Typography fontWeight={600} fontSize={14} mb={1}>
            Phương thức thanh toán
          </Typography>
          <Stack spacing={1}>
            {PAYMENT_OPTIONS.map((opt) => {
              const isBank = opt.value === "BANK_TRANSFER";
              const selected = paymentMethod === opt.value;
              return (
                <Box key={opt.value}>
                  <Box
                    onClick={() => setPaymentMethod(opt.value)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: 1.5,
                      border: "1.5px solid",
                      borderColor: selected ? "#f25c05" : "divider",
                      bgcolor: selected ? "rgba(242,92,5,0.04)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {/* Logo / icon */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: isBank ? "#003087" : "grey.100",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isBank ? (
                        <Typography fontWeight={900} fontSize={12} color="#fff" letterSpacing={-0.5}>
                          MB
                        </Typography>
                      ) : (
                        <Image
                          src="/images/payment/cod.png"
                          alt="COD"
                          width={28}
                          height={28}
                          style={{ objectFit: "contain" }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                    </Box>

                    <Box flex={1} minWidth={0}>
                      <Typography fontSize={13} fontWeight={600} noWrap>
                        {opt.label}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary" noWrap>
                        {opt.desc}
                      </Typography>
                    </Box>

                    {selected && (
                      <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#f25c05", flexShrink: 0 }} />
                    )}
                  </Box>

                  {/* Preview bank info khi chọn BANK_TRANSFER */}
                  {isBank && selected && (
                    <Box
                      sx={{
                        mt: 0.75,
                        p: 1.25,
                        bgcolor: "rgba(0,48,135,0.03)",
                        border: "1px dashed rgba(0,48,135,0.2)",
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "#fff",
                          p: 0.5,
                          borderRadius: 1,
                          border: "1px solid rgba(0,0,0,0.08)",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src="/images/payment/mb-bank-qr.png"
                          alt="QR MB Bank"
                          width={48}
                          height={48}
                          style={{ display: "block" }}
                        />
                      </Box>
                      <Box>
                        <Typography fontSize={12} fontWeight={700} color="#003087">
                          MB Bank · NGUYEN HUY CAO
                        </Typography>
                        <Typography fontSize={13} fontWeight={800} color="text.primary">
                          0800104315301
                        </Typography>
                        <Typography fontSize={11} color="text.secondary">
                          Nội dung: <strong>mã đơn hàng</strong> (hiển thị sau khi đặt)
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
          {paymentMethod === "BANK_TRANSFER" && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Thông tin QR và mã chuyển khoản sẽ hiển thị sau khi đặt hàng.
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Voucher */}
        <Box mb={2.5}>
          <Box display="flex" alignItems="center" gap={0.75} mb={1}>
            <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: "#f25c05" }} />
            <Typography fontWeight={600} fontSize={14}>
              Mã giảm giá
            </Typography>
          </Box>
          {appliedCode ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label={appliedCode}
                color="success"
                onDelete={handleRemoveVoucher}
                size="small"
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
                inputProps={{ style: { textTransform: "uppercase", fontSize: 13 } }}
              />
              <Button
                variant="contained"
                onClick={handleApplyVoucher}
                disabled={quoteLoading || !voucherCode.trim()}
                sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" }, fontSize: 13, textTransform: "none" }}
              >
                {quoteLoading ? <CircularProgress size={18} /> : "Áp dụng"}
              </Button>
            </Stack>
          )}
          {voucherMsg && (
            <Alert severity={voucherMsg.type} sx={{ mt: 1, py: 0.5, fontSize: 12 }} onClose={() => setVoucherMsg(null)}>
              {voucherMsg.text}
            </Alert>
          )}
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Order note */}
        <Box mb={2.5}>
          <Typography fontWeight={600} fontSize={14} mb={1}>
            Ghi chú đơn hàng
          </Typography>
          <TextField
            multiline
            rows={2}
            fullWidth
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder="Ghi chú cho người giao hàng..."
            size="small"
            inputProps={{ style: { fontSize: 13 } }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Price summary */}
        <Stack spacing={0.75} mb={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={14} color="text.secondary">Tạm tính</Typography>
            <Typography fontSize={14} fontWeight={500}>{subtotal.toLocaleString("vi-VN")}₫</Typography>
          </Box>
          {totalDiscount > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={14} color="success.main">Giảm giá</Typography>
              <Typography fontSize={14} fontWeight={600} color="success.main">
                -{totalDiscount.toLocaleString("vi-VN")}₫
              </Typography>
            </Box>
          )}
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={14} color="text.secondary">Phí vận chuyển</Typography>
            <Typography fontSize={14} fontWeight={500} color={shippingFee === 0 ? "success.main" : "text.primary"}>
              {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}₫`}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between" alignItems="center" pt={0.5}>
            <Typography fontWeight={700} fontSize={15}>Tổng cộng</Typography>
            <Typography fontWeight={800} fontSize={20} color="#f25c05">
              {total.toLocaleString("vi-VN")}₫
            </Typography>
          </Box>
        </Stack>

        {selectedItems.length === 0 && (
          <Alert severity="info" sx={{ mb: 2, py: 0.5, fontSize: 12 }}>
            Vui lòng chọn ít nhất một sản phẩm để đặt hàng.
          </Alert>
        )}

        {/* CTA button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handlePlaceOrder}
          disabled={isPending || selectedItems.length === 0}
          sx={{
            bgcolor: "#f25c05",
            "&:hover": { bgcolor: "#e64a19" },
            fontWeight: 700,
            fontSize: 15,
            textTransform: "none",
            py: 1.5,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(242,92,5,0.35)",
          }}
        >
          {isPending ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : selectedItems.length > 0 ? (
            `Đặt hàng — ${total.toLocaleString("vi-VN")}₫`
          ) : (
            "Tiến hành đặt hàng"
          )}
        </Button>

        {/* Trust badges */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          mt={2}
          sx={{ color: "text.secondary" }}
        >
          <Box display="flex" alignItems="center" gap={0.4}>
            <LockOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography fontSize={11}>Bảo mật</Typography>
          </Box>
          <Typography fontSize={11}>•</Typography>
          <Box display="flex" alignItems="center" gap={0.4}>
            <VerifiedUserOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography fontSize={11}>Chính hãng</Typography>
          </Box>
          <Typography fontSize={11}>•</Typography>
          <Box display="flex" alignItems="center" gap={0.4}>
            <LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography fontSize={11}>Toàn quốc</Typography>
          </Box>
        </Stack>

        {/* Clear cart — less prominent */}
        <Box textAlign="center" mt={1.5}>
          <Button
            size="small"
            color="error"
            variant="text"
            onClick={() => setClearConfirmOpen(true)}
            disabled={clearing}
            sx={{ fontSize: 12, textTransform: "none", opacity: 0.7 }}
          >
            Xoá toàn bộ giỏ hàng
          </Button>
        </Box>
      </Box>

      {/* Confirm clear cart dialog */}
      <Dialog
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Xoá toàn bộ giỏ hàng?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thao tác này sẽ xoá tất cả sản phẩm trong giỏ hàng và không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setClearConfirmOpen(false)} sx={{ textTransform: "none" }}>
            Huỷ
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => { setClearConfirmOpen(false); handleClearCart(); }}
            disabled={clearing}
            sx={{ textTransform: "none" }}
          >
            {clearing ? <CircularProgress size={16} color="inherit" /> : "Xoá hết"}
          </Button>
        </DialogActions>
      </Dialog>

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
            width: { xs: "90%", sm: 420 },
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2} fontWeight={700}>
            Cập nhật địa chỉ giao hàng
          </Typography>
          <TextField
            select
            fullWidth
            label="Tỉnh / Thành phố"
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
            label="Xã / Quận / Huyện"
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
            label="Địa chỉ chi tiết (số nhà, đường...)"
            fullWidth
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={() => setModalOpen(false)}>Huỷ</Button>
            <Button
              variant="contained"
              onClick={handleReplaceAddress}
              disabled={!selectedProvince || !selectedCommune || !detailAddress}
              sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" } }}
            >
              Xác nhận
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Paper>
  );
}
