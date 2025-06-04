"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import CartHeroSection from "@/components/cart/CartHeroSection";
import CartItemList from "@/components/cart/CartItemList";
import CartSummary from "@/components/cart/CartSummary";
import ContactCTA from "@/components/cart/NewsletterBanner";

export type CartItem = {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  if (!isLoading && cartItems.length === 0) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
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
      <CartHeroSection />

      <Grid container spacing={4} mt={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <CartItemList items={cartItems} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary items={cartItems} />
        </Grid>
      </Grid>

      <Box mt={4}>
        <ContactCTA />
      </Box>
    </Container>
  );
};

export default CartPage;
