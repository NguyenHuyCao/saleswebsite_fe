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
      <Container sx={{ mb: 10 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rounded" height={220} />
        </Box>
        <Skeleton variant="rounded" height={140} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={140} sx={{ mb: 6 }} />
        <Skeleton variant="rounded" height={200} />
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
