import PromoBanner from "@/components/home/PromoBanner";
import FlashSaleShowcasePage from "@/components/promotion/FlashSaleShowcasePage";
import PromotionInfoBlock from "@/components/promotion/PromotionInfoBlock";
import { Container } from "@mui/material";

const PromotionPage = () => {
  return (
    <>
      <Container sx={{ marginBottom: 10 }}>
        <PromoBanner />
        {/* <FlashSaleSection /> */}
        <FlashSaleShowcasePage />
        <PromotionInfoBlock />
      </Container>
    </>
  );
};

export default PromotionPage;
