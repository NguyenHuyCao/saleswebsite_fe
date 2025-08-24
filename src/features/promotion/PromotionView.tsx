// promotion/PromotionView.tsx
import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import PromotionBanner from "@/components/home/PromotionBanner";
import FinalCallToActionSection from "@/features/about/components/FinalCallToActionSection";

import FlashSaleShowcase from "./components/FlashSaleShowcase";
import PromotionInfoBlock from "./components/PromotionInfoBlock";
import { getPromotions } from "./api";

export default async function PromotionView() {
  const { flashPromotions } = await getPromotions(); // SSR fetch

  return (
    <>
      <PageViewTracker />
      <Container sx={{ mb: 10 }}>
        <FlashSaleShowcase promotions={flashPromotions} />
        <PromotionBanner />
        <PromotionInfoBlock />
        <FinalCallToActionSection />
      </Container>
    </>
  );
}
