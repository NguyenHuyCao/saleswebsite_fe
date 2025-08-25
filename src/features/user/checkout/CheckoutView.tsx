"use client";

import { useEffect, useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { Skeleton, Box, Typography } from "@mui/material";
import ShippingForm from "./components/ShippingForm";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";
import ConfirmButton from "./components/ConfirmButton";

export type CartItem = {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

const CART_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts`;

export default function CheckoutView() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(CART_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok && Array.isArray(json?.data)) {
          setItems(json.data);
        }
      } catch {
        // im lặng để không chặn checkout layout
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const isEmpty = useMemo(
    () => !loading && items.length === 0,
    [loading, items]
  );

  return (
    <Grid container spacing={2} mt={5} mb={10}>
      {/* Left */}
      <Grid size={{ xs: 12, md: 8 }}>
        {loading ? (
          <>
            <Skeleton variant="rounded" height={220} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={160} />
          </>
        ) : (
          <>
            <ShippingForm />
            <PaymentMethod />
          </>
        )}
      </Grid>

      {/* Right */}
      <Grid size={{ xs: 12, md: 4 }}>
        {loading ? (
          <>
            <Skeleton variant="rounded" height={260} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={56} />
          </>
        ) : isEmpty ? (
          <Box p={3} sx={{ borderRadius: 2, border: "1px solid #eee" }}>
            <Typography>Giỏ hàng của bạn đang trống.</Typography>
          </Box>
        ) : (
          <>
            <OrderSummary items={items} />
            <ConfirmButton />
          </>
        )}
      </Grid>
    </Grid>
  );
}
