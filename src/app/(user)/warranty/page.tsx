"use client";

import dynamic from "next/dynamic";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import WarrantyConditions from "@/components/warranty/WarrantyConditions";
import WarrantyConditionsCards from "@/components/warranty/WarrantyConditionsCards";
import WarrantyHeroSection from "@/components/warranty/WarrantyHeroSection";
import WarrantyPageHero from "@/components/warranty/WarrantyPageHero";
import { Container } from "@mui/material";

const WarrantyRequestForm = dynamic(
  () => import("@/components/warranty/WarrantyRequestForm"),
  { ssr: false }
);

const WarrantyPage = () => {
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
};

export default WarrantyPage;
