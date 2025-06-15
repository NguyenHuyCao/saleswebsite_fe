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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CART_COUNT_KEY, ORDERS_COUNT_KEY } from "@/constants/apiKeys";
import { mutate } from "swr";

export type CartItem = {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  discount?: number;
  maxDiscount?: number;
};

type Props = {
  items: CartItem[];
  onApplyVoucher: (code: string) => void;
};

const provinces = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];
const communesMap: Record<string, string[]> = {
  "Hồ Chí Minh": ["Quận 1", "Quận 2", "Thủ Đức"],
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm"],
  "Đà Nẵng": ["Hải Châu", "Sơn Trà"],
};

const CartSummary = ({ items, onApplyVoucher }: Props) => {
  const router = useRouter();
  const [userAddress, setUserAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingType, setShippingType] = useState("standard");
  const [orderNote, setOrderNote] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = shippingType === "express" ? 30000 : 0;
  const total = subtotal + shippingFee;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      const { id } = JSON.parse(user);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUserAddress(data?.data?.address || ""));
    }
  }, []);

  const handleApplyVoucher = () => {
    if (voucherCode.trim()) onApplyVoucher(voucherCode.trim());
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !userAddress) {
      return setSnackbar({
        open: true,
        type: "error",
        message: "Vui lòng nhập địa chỉ giao hàng.",
      });
    }

    setLoading(true);

    try {
      const promotionMap = voucherCode
        ? Object.fromEntries(items.map((i) => [i.productId, voucherCode]))
        : {};

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddress: userAddress,
            paymentMethod,
            shippingNote: orderNote,
            shippingAmount: shippingFee,
            promotionCodeByProductId: promotionMap,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.data?.orderId) {
        mutate(ORDERS_COUNT_KEY);
        mutate(CART_COUNT_KEY);
        setSnackbar({
          open: true,
          type: "success",
          message: "Đặt hàng thành công!",
        });

        setTimeout(() => {
          if (data.data.paymentUrl) {
            window.location.href = data.data.paymentUrl;
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        throw new Error(data?.message || "Đặt hàng thất bại");
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: err.message || "Lỗi không xác định",
      });
    } finally {
      setLoading(false);
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
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts/user`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (res.ok) {
        mutate(CART_COUNT_KEY);
        setSnackbar({
          open: true,
          type: "success",
          message: "Đã xoá toàn bộ giỏ hàng.",
        });
        setTimeout(() => router.push("/"), 1500);
      } else {
        throw new Error(data?.message || "Xoá giỏ hàng thất bại.");
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: err.message || "Đã xảy ra lỗi.",
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
          onChange={(e) => setShippingType(e.target.value)}
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
          onChange={(e) => setPaymentMethod(e.target.value)}
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
        <Button variant="outlined" color="error" onClick={handleClearCart}>
          Xoá tất cả
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Tiến hành đặt hàng"}
        </Button>
      </Stack>

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
            {provinces.map((p) => (
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
            {(communesMap[selectedProvince] || []).map((c) => (
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
};

export default CartSummary;
