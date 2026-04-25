"use client";

import {
  Container,
  Skeleton,
  Typography,
  Box,
  Button,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
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
      if (selectKey) {
        setSelectedKeys(new Set([selectKey]));
      } else {
        setSelectedKeys(new Set(serverItems.map(itemKey)));
      }
    } else {
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
        const base = it.discount ? it.unitPrice / (1 - it.discount) : it.unitPrice;
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

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 5, px: { xs: 2, sm: 3 } }}>
        <Box mb={3}>
          <Skeleton variant="text" width={180} height={20} sx={{ mb: 1.5 }} />
          <Box display="flex" alignItems="center" gap={1.5}>
            <Skeleton variant="circular" width={44} height={44} />
            <Box>
              <Skeleton variant="text" width={200} height={28} />
              <Skeleton variant="text" width={100} height={18} />
            </Box>
          </Box>
        </Box>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} variant="rounded" height={110} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rounded" height={480} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  /* ── Error state ── */
  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 5, px: { xs: 2, sm: 3 } }}>
        <Box
          textAlign="center"
          mt={8}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "error.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 36, color: "error.main" }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Không thể tải giỏ hàng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng kiểm tra kết nối và thử lại.
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" } }}
          >
            Thử lại
          </Button>
        </Box>
      </Container>
    );
  }

  /* ── Empty state ── */
  if (isEmpty) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 5, px: { xs: 2, sm: 3 } }}>
        <Box
          textAlign="center"
          mt={8}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            sx={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              bgcolor: "rgba(242,92,5,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: "#f25c05" }} />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={320}>
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mt={1}>
            <Button
              variant="contained"
              onClick={() => router.push("/product")}
              sx={{
                bgcolor: "#f25c05",
                "&:hover": { bgcolor: "#e64a19" },
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Khám phá sản phẩm
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/")}
              sx={{ textTransform: "none", px: 3 }}
            >
              Về trang chủ
            </Button>
          </Stack>
        </Box>
        <ContactCTA />
      </Container>
    );
  }

  /* ── Main cart ── */
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: { xs: 12, sm: 5 }, px: { xs: 2, sm: 3 } }}>
      <CartHeroSection itemCount={items.length} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Grid container spacing={4} alignItems="flex-start">
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

      <ContactCTA />

      {/* Mobile sticky checkout bar — only visible on xs/sm */}
      <MobileCheckoutBar items={items} selectedKeys={selectedKeys} />
    </Container>
  );
}

function MobileCheckoutBar({
  items,
  selectedKeys,
}: {
  items: CartItem[];
  selectedKeys: Set<string>;
}) {
  const selectedItems = useMemo(
    () => items.filter((i) => selectedKeys.has(itemKey(i))),
    [items, selectedKeys]
  );
  const total = useMemo(
    () => selectedItems.reduce((s, it) => s + it.totalPrice, 0),
    [selectedItems]
  );

  const handleScrollToSummary = () => {
    const el = document.getElementById("cart-summary-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Paper
      elevation={12}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
        left: 0,
        right: 0,
        zIndex: 1100,
        borderRadius: "16px 16px 0 0",
        overflow: "hidden",
        bgcolor: "#fff",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.12)",
      }}
    >
      {/* Orange accent line */}
      <Box sx={{ height: 3, background: "linear-gradient(90deg, #f25c05, #ff8c42)" }} />

      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box minWidth={0}>
          <Typography fontSize={11} color="text.secondary" noWrap>
            {selectedItems.length > 0
              ? `Đã chọn ${selectedItems.length} sản phẩm`
              : "Chưa chọn sản phẩm nào"}
          </Typography>
          <Typography fontWeight={800} fontSize={17} color="#f25c05" lineHeight={1.2} noWrap>
            {selectedItems.length > 0 ? `${total.toLocaleString("vi-VN")}₫` : "—"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleScrollToSummary}
          disabled={selectedItems.length === 0}
          sx={{
            bgcolor: "#f25c05",
            "&:hover": { bgcolor: "#e64a19" },
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            px: 2.5,
            py: 1,
            borderRadius: 2,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxShadow: "0 3px 10px rgba(242,92,5,0.35)",
          }}
        >
          Tới thanh toán →
        </Button>
      </Box>
    </Paper>
  );
}
