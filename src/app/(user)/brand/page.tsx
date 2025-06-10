import BrandAccordionSection from "@/components/brand/BrandAccordionSection";
import BrandHeroSection from "@/components/brand/BrandHeroSection";
import BrandListSection from "@/components/brand/BrandListSection";
import BrandPageFinalSections from "@/components/brand/BrandPageFinalSections";
import WhyChooseUs from "@/components/brand/WhyChooseUs ";
import PageViewTracker from "@/components/traffic/PageViewTracker";
import { Container } from "@mui/material";

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch("http://localhost:8080/api/v1/brands", {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const raw = await res.json();
  return raw.data?.result || [];
}

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
    </>
  );
};

export default BrandPage;
