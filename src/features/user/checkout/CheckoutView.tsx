"use client";

import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { Skeleton, Box, Typography } from "@mui/material";
import ShippingForm from "./components/ShippingForm";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";
import ConfirmButton from "./components/ConfirmButton";
import { useCartQuery } from "./queries";
import type { PaymentMethod as PM, ShippingFormValue } from "./types";

const EMPTY: ShippingFormValue = {
  email: "",
  name: "",
  phone: "",
  address: "",
  province: "",
  commune: "",
  shippingNote: "",
};

export default function CheckoutView() {
  const { data: items, isLoading } = useCartQuery();

  const [shipping, setShipping] = useState<ShippingFormValue>(EMPTY);
  const [method, setMethod] = useState<PM>("cod");

  // nếu có user đã đăng nhập, có thể hydrate form từ localStorage tại đây (tuỳ dự án)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("checkout_shipping");
      if (raw) setShipping(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("checkout_shipping", JSON.stringify(shipping));
    } catch {}
  }, [shipping]);

  const isEmpty = useMemo(
    () => !isLoading && !items?.length,
    [isLoading, items]
  );

  const canSubmit =
    !!shipping.email &&
    !!shipping.name &&
    !!shipping.province &&
    !!shipping.commune &&
    !!items?.length;

  return (
    <Grid container spacing={2} mt={5} mb={10}>
      {/* Left */}
      <Grid size={{ xs: 12, md: 8 }}>
        {isLoading ? (
          <>
            <Skeleton variant="rounded" height={220} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={160} />
          </>
        ) : (
          <>
            <ShippingForm value={shipping} onChange={setShipping} />
            <PaymentMethod value={method} onChange={setMethod} />
          </>
        )}
      </Grid>

      {/* Right */}
      <Grid size={{ xs: 12, md: 4 }}>
        {isLoading ? (
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
            <OrderSummary items={items!} />
            <ConfirmButton
              disabled={!canSubmit}
              getPayload={() => ({ method, shipping })}
              onSuccess={() => {
                // tuỳ bạn: điều hướng tới trang /orders/:id hoặc clear cache
              }}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
}
