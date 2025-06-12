import FlashSaleShowcasePage from "@/components/promotion/FlashSaleShowcasePage";
import PromotionInfoBlock from "@/components/promotion/PromotionInfoBlock";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";
import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";
import PromotionBanner from "@/components/home/PromotionBanner";
import FinalCallToActionSection from "@/components/about/FinalCallToActionSection";

const PromotionPage = () => {
  return (
    <>
      <PageViewTracker />
      <Container sx={{ marginBottom: 10 }}>
        <FlashSaleShowcasePage />
        <PromotionBanner />
        <PromotionInfoBlock />
        <FinalCallToActionSection />
      </Container>
      <FreezeScrollOnReload />
    </>
  );
};

export default PromotionPage;
