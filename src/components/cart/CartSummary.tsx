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

interface OrderResponse {
  orderId: number;
  status: string;
  paymentUrl?: string;
}

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = shippingType === "express" ? 30000 : 0;
  const total = subtotal + shippingFee;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("accessToken");
      const userString = localStorage.getItem("user");
      if (!token || !userString) return;

      try {
        const user = JSON.parse(userString);
        const res = await fetch(
          `http://localhost:8080/api/v1/users/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok && data?.data?.address) {
          setUserAddress(data.data.address);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProvince("");
    setSelectedCommune("");
    setDetailAddress("");
  };

  const handleReplaceAddress = () => {
    if (!selectedProvince || !selectedCommune || !detailAddress) return;
    const newAddress = `${detailAddress}, ${selectedCommune}, ${selectedProvince}`;
    setUserAddress(newAddress);
    handleCloseModal();
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim()) onApplyVoucher(voucherCode.trim());
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !userAddress) {
      setSnackbarType("error");
      setSnackbarMessage("Vui lòng nhập địa chỉ giao hàng.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    const promotionCodeByProductId: Record<number, string> = {};
    if (voucherCode) {
      for (const item of items) {
        promotionCodeByProductId[item.productId] = voucherCode;
      }
    }

    const payload = {
      shippingAddress: userAddress,
      paymentMethod,
      shippingNote: orderNote,
      shippingAmount: shippingFee,
      promotionCodeByProductId,
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: { data: OrderResponse; message?: string } = await res.json();

      if (res.ok && data.data?.orderId) {
        setSnackbarType("success");
        setSnackbarMessage("Đặt hàng thành công!");
        setSnackbarOpen(true);

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
    } catch (error: any) {
      console.error("Lỗi khi đặt hàng:", error);
      setSnackbarType("error");
      setSnackbarMessage(error.message || "Lỗi không xác định");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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
            label="Giao hàng tiêu chuẩn (miễn phí)"
          />
          <FormControlLabel
            value="express"
            control={<Radio />}
            label="Giao hàng nhanh (30.000₫)"
          />
        </RadioGroup>
      </Box>

      <Box mb={2}>
        <Typography>Địa chỉ giao hàng:</Typography>
        <Typography variant="body2" color="text.secondary">
          {userAddress || "Chưa có địa chỉ"}
        </Typography>
        <Button size="small" sx={{ mt: 1 }} onClick={handleOpenModal}>
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

      <Box mb={2}>
        <Typography mb={1}>Ghi chú đơn hàng (nếu có):</Typography>
        <TextField
          fullWidth
          placeholder="Ví dụ: Giao vào buổi chiều, gọi trước khi đến..."
          multiline
          rows={3}
          size="small"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
        />
      </Box>

      <Stack direction="row" spacing={1} mb={2}>
        <TextField
          fullWidth
          placeholder="Nhập mã giảm giá"
          size="small"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
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
        <Button variant="outlined" color="error">
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

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Cập nhật địa chỉ giao hàng
          </Typography>

          <TextField
            select
            label="Tỉnh"
            fullWidth
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedCommune("");
            }}
            sx={{ mb: 2 }}
          >
            {provinces.map((province) => (
              <MenuItem key={province} value={province}>
                {province}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Xã/Quận"
            fullWidth
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            disabled={!selectedProvince}
            sx={{ mb: 2 }}
          >
            {(communesMap[selectedProvince] || []).map((commune) => (
              <MenuItem key={commune} value={commune}>
                {commune}
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

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleCloseModal}>Huỷ</Button>
            <Button variant="contained" onClick={handleReplaceAddress}>
              Thay thế
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={snackbarType === "error" ? 6000 : 4000}
      >
        <Alert
          severity={snackbarType}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CartSummary;
