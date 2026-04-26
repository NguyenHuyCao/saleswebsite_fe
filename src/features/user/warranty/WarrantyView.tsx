import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import WarrantyHeroSection from "./components/WarrantyHeroSection";
import WarrantyStats from "./components/WarrantyStats";
import WarrantyPolicyTabs from "./components/WarrantyPolicyTabs";
import WarrantyLookup from "./components/WarrantyLookup";
import WarrantyRequestForm from "./components/WarrantyRequestForm";
import WarrantyHistory from "./components/WarrantyHistory";
import WarrantyServiceCenters from "./components/WarrantyServiceCenters";
import WarrantyFAQ from "./components/WarrantyFAQ";

export default function WarrantyView() {
  return (
    <>
      <PageViewTracker />
      <WarrantyHeroSection />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <WarrantyStats />
        <WarrantyPolicyTabs />
        <WarrantyLookup />
        <WarrantyRequestForm />
        <WarrantyHistory />
        <WarrantyServiceCenters />
        <WarrantyFAQ />
      </Container>
    </>
  );
}
