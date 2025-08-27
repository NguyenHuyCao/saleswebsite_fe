"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Skeleton, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard from "@/features/user/products/components/ProductCard";
import type { Product } from "@/features/user/products/types";
import { api, toApiError } from "@/lib/api/http";
import type { Promotion } from "../types";   // <- dùng type chung, KHÔNG tự định nghĩa lại

type PromotionDetail = Promotion & { products?: any[] };

type Props = {
  promotion: Promotion;
  allPromotions?: Promotion[]; // để linh hoạt, không bắt buộc
};

export default function FlashSaleSlider({ promotion, allPromotions = [] }: Props) {
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

        const now = new Date();
        const mapped: Product[] =
          (detail.products || []).map((item: any) => {
            const createdAt = new Date(item.createdAt);
            const isNew = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;

            const price = item.pricePerUnit ?? item.price ?? 0;
            const originalPrice = item.price ?? price;
            const inStock = !!(item.active === true && item.stockQuantity > 0);

            return {
              id: item.id,
              name: item.name,
              slug: item.slug,
              imageAvt: item.imageAvt,
              imageDetail1: item.imageDetail1 || "",
              imageDetail2: item.imageDetail2 || "",
              imageDetail3: item.imageDetail3 || "",
              description: item.description,
              price,
              pricePerUnit: price,
              originalPrice,
              sale: originalPrice > price,
              inStock,
              label: inStock ? "Thêm vào giỏ" : "Hết hàng",
              stockQuantity: item.stockQuantity ?? 0,
              totalStock: item.totalStock ?? 0,
              power: item.power || "",
              fuelType: item.fuelType || "",
              engineType: item.engineType || "",
              weight: item.weight || 0,
              dimensions: item.dimensions || "",
              tankCapacity: item.tankCapacity || 0,
              origin: item.origin || "",
              warrantyMonths: item.warrantyMonths || 0,
              createdAt: item.createdAt,
              createdBy: item.createdBy || "",
              updatedAt: item.updatedAt || null,
              updatedBy: item.updatedBy || "",
              rating: item.rating || 0,
              status: (item.stockQuantity ?? 0) === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
              favorite: item.wishListUser === true,
            } as Product;
          }) ?? [];

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
        <Typography variant="h6" fontWeight={800} color="warning.main">
          🔥 Flash Sale {promotion?.name ? `– ${promotion.name}` : ""}
        </Typography>
        <Box>
          <IconButton size="small" sx={{ mr: 0.5 }}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
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
