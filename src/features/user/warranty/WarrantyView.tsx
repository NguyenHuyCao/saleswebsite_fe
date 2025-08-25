// warranty/WarrantyView.tsx
import { Container } from "@mui/material";
import dynamic from "next/dynamic";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import WarrantyHeroSection from "./components/WarrantyHeroSection";
import WarrantyConditionsCards from "./components/WarrantyConditionsCards";
import WarrantyPageHero from "./components/WarrantyPageHero";
import WarrantyConditions from "./components/WarrantyConditions";

import WarrantyRequestForm from "./components/WarrantyRequestForm";

export default async function WarrantyView() {
  // Nếu sau này cần preload config từ backend, fetch ở đây (server)
  return (
    <>
      <PageViewTracker />
      <WarrantyHeroSection />
      <Container>
        <WarrantyConditionsCards />
        <WarrantyPageHero />
        <WarrantyConditions />
        <WarrantyRequestForm />
      </Container>
    </>
  );
}
