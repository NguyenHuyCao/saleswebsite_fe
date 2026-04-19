"use client";

import { Container, Skeleton, Typography, Box, Button, Alert } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RefreshIcon from "@mui/icons-material/Refresh";
import CartHeroSection from "./components/CartHeroSection";
import CartItemList from "./components/CartItemList";
import CartSummary from "./components/CartSummary";
import ContactCTA from "./components/ContactCTA";
import { useCartQuery, useValidateVoucherMutation } from "./queries";
import type { CartItem } from "./types";

const itemKey = (i: CartItem) =>
  i.variantId ? `${i.productId}-${i.variantId}` : String(i.productId);

type Props = { selectKey?: string };

export default function CartView({ selectKey }: Props) {
  const router = useRouter();

  const { data: serverItems, isLoading, isError, refetch } = useCartQuery();

  const [items, setItems] = useState<CartItem[]>([]);
  const [original, setOriginal] = useState<CartItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const { mutateAsync: validateVoucher } = useValidateVoucherMutation();

  // Track last selectKey to detect param changes (e.g. same-route navigation)
  const lastSelectKeyRef = useRef<string | undefined>(undefined);
  const selectionInitialized = useRef(false);

  useEffect(() => {
    if (serverItems === undefined) return;
    setItems(serverItems);
    setOriginal(serverItems);

    const isFirstInit = !selectionInitialized.current;
    const selectKeyChanged = selectKey !== lastSelectKeyRef.current;

    lastSelectKeyRef.current = selectKey;
    selectionInitialized.current = true;

    if (isFirstInit || selectKeyChanged) {
      // Initial load OR selectKey changed (same-route navigation) → reset selection
      if (selectKey) {
        setSelectedKeys(new Set([selectKey]));
      } else {
        setSelectedKeys(new Set(serverItems.map(itemKey)));
      }
    } else {
      // Mutation refetch: prune keys for items that were removed from cart
      setSelectedKeys((prev) => {
        const validKeys = new Set(serverItems.map(itemKey));
        const pruned = new Set([...prev].filter((k) => validKeys.has(k)));
        return pruned.size === prev.size ? prev : pruned;
      });
    }
  }, [serverItems, selectKey]);

  const isEmpty = useMemo(
    () => !isLoading && !isError && serverItems !== undefined && serverItems.length === 0,
    [isLoading, isError, serverItems]
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
      // error shown inside CartSummary
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 5, px: { xs: 2, sm: 3 } }}>
      {isLoading ? (
        <Grid container spacing={4} mt={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rounded" height={240} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      ) : isError ? (
        <Box textAlign="center" mt={6}>
          <Alert severity="error" sx={{ mb: 2, justifyContent: "center" }}>
            Không thể tải giỏ hàng. Vui lòng kiểm tra kết nối và thử lại.
          </Alert>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" } }}
          >
            Tải lại
          </Button>
        </Box>
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
                <CartItemList
                  items={items}
                  onItemsChange={setItems}
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CartSummary
                  items={items}
                  selectedKeys={selectedKeys}
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
