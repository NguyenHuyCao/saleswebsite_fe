import PromoBanner from "@/components/home/PromoBanner";
import CountdownPromotion from "@/components/promotion/CountdownPromotion";
import PromotionInfoBlock from "@/components/promotion/PromotionInfoBlock";
import { Container } from "@mui/material";

const PromotionPage = () => {
  const deadline = "2025-06-30T23:59:59";
  return (
    <>
      <Container>
        <PromoBanner />
        <CountdownPromotion deadline={deadline} />
        <PromotionInfoBlock />
      </Container>
    </>
  );
};

export default PromotionPage;
