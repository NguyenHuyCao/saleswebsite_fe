// import StoreCommitmentSection from "@/components/system/StoreCommitmentSection";
import StoreHeroSection from "@/components/system/SystemStore";
import PageViewTracker from "@/components/traffic/PageViewTracker";
import { Container } from "@mui/material";

const SystemPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <StoreHeroSection />
      {/* <StoreCommitmentSection /> */}
    </Container>
  );
};

export default SystemPage;
