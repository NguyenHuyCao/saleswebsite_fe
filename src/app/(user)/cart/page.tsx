"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CartHeroSection from "@/components/cart/CartHeroSection";
import CartItemList from "@/components/cart/CartItemList";
import CartSummary from "@/components/cart/CartSummary";
import ContactCTA from "@/components/cart/NewsletterBanner";
import PageViewTracker from "@/components/traffic/PageViewTracker";

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
    const fetchCartData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/v1/carts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data?.data) {
          setCartItems(data.data);
          setOriginalItems(data.data);
        } else {
          console.error("Lỗi khi lấy giỏ hàng:", data?.message);
        }
      } catch (err) {
        console.error("Lỗi kết nối:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleApplyVoucher = async (code: string) => {
    if (!code) {
      setCartItems(originalItems);
      setSnackbar({
        open: true,
        type: "success",
        message: "Đã xoá mã giảm giá và khôi phục giá gốc.",
      });
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/promotions/validate?code=${code}`
      );
      const data = await res.json();

      if (res.ok && data?.data) {
        const promotion = data.data;
        const { discount, maxDiscount, applicableProductIds } = promotion;

        let applied = false;
        const updatedItems = cartItems.map((item) => {
          if (applicableProductIds.includes(item.productId)) {
            applied = true;
            const originalPrice = item.unitPrice / (1 - item.discount);
            const discountedPrice = Math.max(
              originalPrice * (1 - discount),
              originalPrice - maxDiscount
            );
            const newUnitPrice = Math.round(discountedPrice);
            return {
              ...item,
              unitPrice: newUnitPrice,
              totalPrice: newUnitPrice * item.quantity,
              discount,
              maxDiscount,
            };
          }
          return item;
        });

        if (applied) {
          setCartItems(updatedItems);
          setSnackbar({
            open: true,
            type: "success",
            message: "Áp dụng mã giảm giá thành công.",
          });
        } else {
          setSnackbar({
            open: true,
            type: "error",
            message: "Mã này không áp dụng cho sản phẩm trong giỏ hàng.",
          });
        }
      } else {
        setSnackbar({
          open: true,
          type: "error",
          message: data.message || "Mã này không tồn tại",
        });
      }
    } catch (error) {
      console.error("Lỗi kiểm tra mã:", error);
      setSnackbar({
        open: true,
        type: "error",
        message: "Không thể kiểm tra mã giảm giá.",
      });
    }
  };

  if (!isLoading && cartItems.length === 0) {
    return (
      <Container sx={{ mt: 8, textAlign: "center", mb: 10 }}>
        <PageViewTracker />
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
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <PageViewTracker />
      <CartHeroSection />
      <Grid container spacing={4} mt={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <CartItemList items={cartItems} onItemsChange={setCartItems} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary items={cartItems} onApplyVoucher={handleApplyVoucher} />
        </Grid>
      </Grid>

      <Box mt={4}>
        <ContactCTA />
      </Box>

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={snackbar.type === "error" ? 6000 : 4000}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;
