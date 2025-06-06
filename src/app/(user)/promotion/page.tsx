import FlashSaleSection from "@/components/home/FlashSaleSection";
import PromoBanner from "@/components/home/PromoBanner";
import PromotionInfoBlock from "@/components/promotion/PromotionInfoBlock";
import { Container } from "@mui/material";

const PromotionPage = () => {
  return (
    <>
      <Container sx={{ marginBottom: 10 }}>
        <PromoBanner />
        <FlashSaleSection />
        <PromotionInfoBlock />
      </Container>
    </>
  );
};

export default PromotionPage;
