// warranty/WarrantyView.tsx
import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import WarrantyHeroSection from "./components/WarrantyHeroSection";
import WarrantyStats from "./components/WarrantyStats";
import WarrantyPolicyTabs from "./components/WarrantyPolicyTabs";
import WarrantyLookup from "./components/WarrantyLookup";
import WarrantyRequestForm from "./components/WarrantyRequestForm";
import WarrantyHistory from "./components/WarrantyHistory";
import WarrantyFAQ from "./components/WarrantyFAQ";

export default async function WarrantyView() {
  return (
    <>
      <PageViewTracker />

      {/* Hero Section */}
      <WarrantyHeroSection />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Stats Overview */}
        <WarrantyStats />

        {/* Policy Tabs */}
        <WarrantyPolicyTabs />

        {/* Warranty Lookup & Request */}
        <WarrantyLookup />
        <WarrantyRequestForm />

        {/* Warranty History */}
        <WarrantyHistory />

        {/* FAQ */}
        <WarrantyFAQ />
      </Container>
    </>
  );
}
