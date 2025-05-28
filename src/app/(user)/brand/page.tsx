import BrandAccordionSection from "@/components/brand/BrandAccordionSection";
import BrandHeroSection from "@/components/brand/BrandHeroSection";
import BrandListSection from "@/components/brand/BrandListSection";
import BrandPageFinalSections from "@/components/brand/BrandPageFinalSections";
import WhyChooseUs from "@/components/brand/WhyChooseUs ";
import { Container } from "@mui/material";

const BrandPage = () => {
  return (
    <>
      <BrandHeroSection />
      <Container>
        <BrandListSection />
        <WhyChooseUs />
        <BrandAccordionSection />
        <BrandPageFinalSections />
      </Container>
    </>
  );
};

export default BrandPage;
