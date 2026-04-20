// promotion/PromotionViewClient.tsx
"use client";

import { Box, Container, Skeleton, Alert } from "@mui/material";
import FlashSaleShowcase from "./components/FlashSaleShowcase";
import PromotionBanner from "./components/PromotionBanner";
import PromotionInfoBlock from "./components/PromotionInfoBlock";
import FinalCallToActionSection from "../about/components/FinalCallToActionSection";
import { usePromotions } from "./hooks";

export default function PromotionViewClient() {
  const { data, isLoading, isError, error } = usePromotions();

  if (isLoading) {
    return (
      <Container sx={{ mb: 10, pt: { xs: 3, sm: 4 } }}>
        {/* TwoStrokePromoBanner skeleton */}
        <Skeleton variant="rounded" height={{ xs: 420, sm: 380, md: 360 } as any} sx={{ mb: 4, borderRadius: 3 }} />
        {/* Flash sale header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, mb: 3 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={160} height={32} />
            <Skeleton variant="text" width={120} height={20} />
          </Box>
        </Box>
        {/* Flash sale slider */}
        <Skeleton variant="rounded" height={380} sx={{ mb: 4, borderRadius: 3 }} />
        {/* Promotion banners */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
          <Skeleton variant="rounded" height={260} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" height={260} sx={{ borderRadius: 2 }} />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ mb: 10 }}>
        <Alert severity="error">
          {(error as Error)?.message || "Không tải được khuyến mãi."}
        </Alert>
      </Container>
    );
  }

  const { flashPromotions } = data!;

  return (
    <Container sx={{ mb: 10 }}>
      <FlashSaleShowcase promotions={flashPromotions} />
      <PromotionBanner />
      <PromotionInfoBlock />
      <FinalCallToActionSection />
    </Container>
  );
}
