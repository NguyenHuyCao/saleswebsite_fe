import WarrantyConditions from "@/components/warranty/WarrantyConditions";
import WarrantyConditionsCards from "@/components/warranty/WarrantyConditionsCards";
import WarrantyHeroSection from "@/components/warranty/WarrantyHeroSection";
import WarrantyPageHero from "@/components/warranty/WarrantyPageHero";
import WarrantyRequestForm from "@/components/warranty/WarrantyRequestForm";
import { Container } from "@mui/material";

const WarrantyPage = () => {
  return (
    <>
      <WarrantyHeroSection />
      <Container>
        <WarrantyConditionsCards />
        <WarrantyPageHero />
        <WarrantyConditions />
        <WarrantyRequestForm />
      </Container>
    </>
  );
};

export default WarrantyPage;
