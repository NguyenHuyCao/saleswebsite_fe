import BrandAccordionSection from "@/components/brand/BrandAccordionSection";
import BrandHeroSection from "@/components/brand/BrandHeroSection";
import BrandListSection from "@/components/brand/BrandListSection";
import BrandPageFinalSections from "@/components/brand/BrandPageFinalSections";
import WhyChooseUs from "@/components/brand/WhyChooseUs ";
// import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { getBrands } from "@/lib/api/brand";
import { Container } from "@mui/material";

const BrandPage = async () => {
  const brands = await getBrands();

  return (
    <>
      <PageViewTracker />
      <BrandHeroSection />
      <Container>
        <BrandListSection brands={brands} />
        <WhyChooseUs />
        <BrandAccordionSection brands={brands} />
        <BrandPageFinalSections />
      </Container>
      {/* <FreezeScrollOnReload /> */}
    </>
  );
};

export default BrandPage;
