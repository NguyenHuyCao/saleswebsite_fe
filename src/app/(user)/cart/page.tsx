"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Snackbar,
  Alert,
  Skeleton,
  Typography,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CartHeroSection from "@/components/cart/CartHeroSection";
import CartItemList from "@/components/cart/CartItemList";
import CartSummary from "@/components/cart/CartSummary";
import ContactCTA from "@/components/cart/NewsletterBanner";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";

export type CartItem = {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  discount: number;
  maxDiscount: number;
};

const ITEMS_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts`;
const VOUCHER_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promotions/validate`;

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [originalItems, setOriginalItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return setIsLoading(false);

      try {
        const res = await fetch(ITEMS_API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && Array.isArray(data?.data)) {
          setCartItems(data.data);
          setOriginalItems(data.data);
        } else {
          console.error("Lỗi lấy giỏ hàng:", data?.message);
        }
      } catch (err) {
        console.error("Lỗi kết nối:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleApplyVoucher = async (code: string) => {
    if (!code) {
      setCartItems(originalItems);
      return setSnackbar({
        open: true,
        type: "success",
        message: "Đã xóa mã giảm giá và khôi phục giá gốc.",
      });
    }

    try {
      const res = await fetch(`${VOUCHER_API}?code=${code}`);
      const data = await res.json();

      if (res.ok && data?.data) {
        const { discount, maxDiscount, applicableProductIds } = data.data;
        let applied = false;

        const updated = cartItems.map((item) => {
          if (applicableProductIds.includes(item.productId)) {
            applied = true;
            const original = item.unitPrice / (1 - item.discount);
            const discountedPrice = Math.max(
              original * (1 - discount),
              original - maxDiscount
            );
            const newPrice = Math.round(discountedPrice);

            return {
              ...item,
              unitPrice: newPrice,
              totalPrice: newPrice * item.quantity,
              discount,
              maxDiscount,
            };
          }
          return item;
        });

        setCartItems(updated);
        setSnackbar({
          open: true,
          type: applied ? "success" : "error",
          message: applied
            ? "Áp dụng mã giảm giá thành công."
            : "Mã không áp dụng cho sản phẩm nào trong giỏ.",
        });
      } else {
        setSnackbar({
          open: true,
          type: "error",
          message: data.message || "Mã giảm giá không tồn tại.",
        });
      }
    } catch (err) {
      console.error("Lỗi áp dụng mã:", err);
      setSnackbar({
        open: true,
        type: "error",
        message: "Không thể kiểm tra mã giảm giá.",
      });
    }
  };

  const isEmpty = useMemo(
    () => !isLoading && cartItems.length === 0,
    [isLoading, cartItems]
  );

  return (
    <Container sx={{ mt: 4, mb: 5 }}>
      <PageViewTracker />

      {isLoading ? (
        <Grid container spacing={4} mt={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rounded" height={240} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      ) : isEmpty ? (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" mb={2}>
            Giỏ hàng của bạn đang trống.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/product")}
          >
            Mua sắm ngay
          </Button>
        </Box>
      ) : (
        <>
          <CartHeroSection />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Grid container spacing={4} mt={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <CartItemList items={cartItems} onItemsChange={setCartItems} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CartSummary
                  items={cartItems}
                  onApplyVoucher={handleApplyVoucher}
                />
              </Grid>
            </Grid>
          </motion.div>
        </>
      )}

      <Box mt={4}>
        <ContactCTA />
      </Box>

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={snackbar.type === "error" ? 6000 : 4000}
      >
        <Alert
          severity={snackbar.type}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;
