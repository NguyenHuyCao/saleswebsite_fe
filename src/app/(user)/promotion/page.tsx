import CountdownPromotion from "@/components/home/CountdownPromotion";
import FlashSaleSlider from "@/components/home/FlashSaleSlider";
import PromoBanner from "@/components/home/PromoBanner";
import PromotionInfoBlock from "@/components/promotion/PromotionInfoBlock";
// import CountdownPromotion from "@/components/promotion/CountdownPromotion";
import { Container } from "@mui/material";

const PromotionPage = () => {
  const deadline = "2025-06-30T23:59:59";
  return (
    <>
      <Container sx={{ marginBottom: 10 }}>
        <PromoBanner />
        {/* <CountdownPromotion deadline={deadline} /> */}
        <CountdownPromotion deadline={deadline} />
        <FlashSaleSlider />
        <PromotionInfoBlock />
      </Container>
    </>
  );
};

export default PromotionPage;
