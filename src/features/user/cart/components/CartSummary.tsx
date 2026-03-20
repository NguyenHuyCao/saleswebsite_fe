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
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mutate as swrMutate } from "swr";
import { CART_COUNT_KEY, ORDERS_COUNT_KEY } from "@/constants/apiKeys";
import type { CartItem } from "../types";
import {
  useClearCartMutation,
  usePlaceOrderMutation,
  useUserAddressQuery,
} from "../queries";
import { provinceNames, getDistricts } from "../constants/vietnamAddresses";

type Props = { items: CartItem[]; onApplyVoucher: (code: string) => void };

export default function CartSummary({ items, onApplyVoucher }: Props) {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  // lấy userId từ localStorage (client)
  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUserId(JSON.parse(u)?.id ?? null);
    } catch {}
  }, []);

  // query địa chỉ hiện tại
  const { data: fetchedAddress } = useUserAddressQuery(userId ?? undefined);
  const [userAddress, setUserAddress] = useState("");
  useEffect(() => {
    if (fetchedAddress) setUserAddress(fetchedAddress);
  }, [fetchedAddress]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MOMO">("COD");
  const [shippingType, setShippingType] = useState<"standard" | "express">(
    "standard"
  );
  const [orderNote, setOrderNote] = useState("");
  const [voucherCode, setVoucherCode] = useState("");

  type SnackbarType = "success" | "error" | "info" | "warning";
  type SnackbarState = { open: boolean; message: string; type: SnackbarType };
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    type: "success",
    message: "",
  });

  const { mutateAsync: clearCart, isPending: clearing } =
    useClearCartMutation();
  const { mutateAsync: place, isPending } = usePlaceOrderMutation();

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.totalPrice, 0),
    [items]
  );
  const shippingFee = shippingType === "express" ? 30000 : 0;
  const total = subtotal + shippingFee;

  const handleApplyVoucher = () =>
    voucherCode.trim() && onApplyVoucher(voucherCode.trim());

  const handlePlaceOrder = async () => {
    if (!userAddress) {
      return setSnackbar({
        open: true,
        type: "error",
        message: "Vui lòng nhập địa chỉ giao hàng.",
      });
    }
    try {
      const promotionMap = voucherCode
        ? Object.fromEntries(items.map((i) => [i.productId, voucherCode]))
        : {};
      const data = await place({
        shippingAddress: userAddress,
        paymentMethod,
        shippingNote: orderNote,
        shippingAmount: shippingFee,
        promotionCodeByProductId: promotionMap,
      });
      swrMutate(ORDERS_COUNT_KEY);
      swrMutate(CART_COUNT_KEY);
      setSnackbar({
        open: true,
        type: "success",
        message: "Đặt hàng thành công!",
      });
      setTimeout(() => {
        if (data?.paymentUrl) window.location.href = data.paymentUrl;
        else router.push("/");
      }, 1200);
    } catch (e: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: e?.message || "Đặt hàng thất bại",
      });
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
      setSnackbar({
        open: true,
        type: "success",
        message: "Đã xoá toàn bộ giỏ hàng.",
      });
      setTimeout(() => router.push("/"), 1000);
    } catch (e: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: e?.message || "Xoá giỏ hàng thất bại.",
      });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Tổng kết đơn hàng
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Thành tiền:</Typography>
        <Typography fontWeight={600}>
          {subtotal.toLocaleString("vi-VN")}₫
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography mb={1}>Phí vận chuyển:</Typography>
        <RadioGroup
          value={shippingType}
          onChange={(e) => setShippingType(e.target.value as any)}
        >
          <FormControlLabel
            value="standard"
            control={<Radio />}
            label="Tiêu chuẩn (Miễn phí)"
          />
          <FormControlLabel
            value="express"
            control={<Radio />}
            label="Giao nhanh (30.000₫)"
          />
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
        <Typography>Phương thức thanh toán:</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as any)}
        >
          <FormControlLabel
            value="COD"
            control={<Radio />}
            label="Thanh toán khi nhận hàng"
          />
          <FormControlLabel
            value="MOMO"
            control={<Radio />}
            label="Ví điện tử MoMo"
          />
        </RadioGroup>
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

      <Stack direction="row" spacing={1} mb={2}>
        <TextField
          placeholder="Nhập mã giảm giá"
          size="small"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" onClick={handleApplyVoucher}>
          Áp dụng
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography fontWeight={600}>Tổng cộng:</Typography>
        <Typography fontWeight={700} color="primary">
          {total.toLocaleString("vi-VN")}₫
        </Typography>
      </Box>

      <Stack spacing={1}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearCart}
          disabled={clearing}
        >
          Xoá tất cả
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={22} /> : "Tiến hành đặt hàng"}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.type === "error" ? 6000 : 4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
