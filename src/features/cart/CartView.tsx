"use client";

import { Container, Skeleton, Typography, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CartHeroSection from "./components/CartHeroSection";
import CartItemList from "./components/CartItemList";
import CartSummary from "./components/CartSummary";
import ContactCTA from "./components/ContactCTA";
import { useCartQuery, useValidateVoucherMutation } from "./queries";
import type { CartItem } from "./types";

export default function CartView() {
  const router = useRouter();

  // 1) load cart từ server (react-query)
  const { data: serverItems, isLoading } = useCartQuery();

  // 2) local copy để áp mã giảm giá (không ghi xuống server)
  const [items, setItems] = useState<CartItem[]>(serverItems ?? []);
  const [original, setOriginal] = useState<CartItem[]>(serverItems ?? []);
  const { mutateAsync: validateVoucher } = useValidateVoucherMutation();

  // đồng bộ khi serverItems đổi
  // (không dùng useEffect để tránh extra renders – set tại lần đầu & khi refetch về)
  if (
    items.length === 0 &&
    (serverItems?.length ?? 0) > 0 &&
    original.length === 0
  ) {
    setItems(serverItems as CartItem[]);
    setOriginal(serverItems as CartItem[]);
  }

  const isEmpty = useMemo(
    () => !isLoading && (items?.length ?? 0) === 0,
    [isLoading, items]
  );

  const handleApplyVoucher = async (code: string) => {
    if (!code) {
      setItems(original);
      return;
    }
    try {
      const v = await validateVoucher(code);
      const updated = (items ?? []).map((it) => {
        if (!v.applicableProductIds.includes(it.productId)) return it;

        // khôi phục giá gốc từ unitPrice/discount cũ (nếu có)
        const base = it.discount
          ? it.unitPrice / (1 - it.discount)
          : it.unitPrice;
        const pctPrice = base * (1 - v.discount);
        const capPrice = base - v.maxDiscount;
        const newUnit = Math.max(pctPrice, capPrice);

        return {
          ...it,
          unitPrice: Math.round(newUnit),
          totalPrice: Math.round(newUnit) * it.quantity,
          discount: v.discount,
          maxDiscount: v.maxDiscount,
        };
      });
      setItems(updated);
    } catch {
      // giữ nguyên, hiển thị message tại CartSummary (nó có snackbar)
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 5 }}>
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
          <Button variant="contained" onClick={() => router.push("/product")}>
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
                <CartItemList items={items} onItemsChange={setItems} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CartSummary
                  items={items}
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
    </Container>
  );
}
