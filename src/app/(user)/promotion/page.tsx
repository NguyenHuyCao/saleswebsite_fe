import PromoBanner from "@/components/home/PromoBanner";
import FlashSaleShowcasePage from "@/components/promotion/FlashSaleShowcasePage";
import PromotionInfoBlock from "@/components/promotion/PromotionInfoBlock";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";
import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";

const PromotionPage = () => {
  return (
    <>
      <PageViewTracker />
      <Container sx={{ marginBottom: 10 }}>
        <PromoBanner />
        {/* <FlashSaleSection /> */}
        <FlashSaleShowcasePage />
        <PromotionInfoBlock />
      </Container>
      <FreezeScrollOnReload />
    </>
  );
};

export default PromotionPage;
