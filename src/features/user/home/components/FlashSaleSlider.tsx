"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Skeleton, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard from "@/features/user/products/components/ProductCard";
import type { Product } from "@/features/user/products/types";
import { api, toApiError } from "@/lib/api/http";
import { mapProduct } from "@/lib/utils/productMapper";
import type { Promotion } from "../types";

type PromotionDetail = Promotion & { products?: any[] };

type Props = {
  promotion: Promotion;
  allPromotions?: Promotion[];
};

export default function FlashSaleSlider({ promotion }: Props) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const mutateKey = useMemo(
    () => `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promotions/${promotion.id}`,
    [promotion?.id]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const detail = await api.get<PromotionDetail>(`/api/v1/promotions/${promotion.id}`);

        // Use the promotion's discount to compute sale price for each product card.
        // detail.discount may be 0-1 (fraction) or 0-100 (percent) — mapProduct normalises it.
        const discountPct = detail.discount ?? 0;
        const nowMs = Date.now();

        const mapped: Product[] = (detail.products || []).map((item: any) =>
          mapProduct(item, nowMs, discountPct)
        );

        if (mounted) setItems(mapped);
      } catch (e) {
        console.error("Lỗi tải chi tiết khuyến mãi:", toApiError(e).message);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [promotion?.id]);

  return (
    <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#fff", border: "1px solid #eee" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography component="h2" variant="h6" fontWeight={800} color="warning.main">
          🔥 Flash Sale {promotion?.name ? `– ${promotion.name}` : ""}
        </Typography>
        <Box>
          <IconButton size="small" aria-label="Trang trước" sx={{ mr: 0.5 }}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="Trang tiếp">
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Stack>

      {loading ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={420} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">Chưa có sản phẩm áp dụng.</Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {items.map((product) => (
            <ProductCard key={product.id} product={product} mutateKey={mutateKey} />
          ))}
        </Box>
      )}
    </Box>
  );
}
