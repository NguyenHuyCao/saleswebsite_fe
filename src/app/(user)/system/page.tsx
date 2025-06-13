// import StoreCommitmentSection from "@/components/system/StoreCommitmentSection";
import StoreHeroSection from "@/components/system/SystemStore";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";
// import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";

const SystemPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <StoreHeroSection />
      {/* <FreezeScrollOnReload /> */}
    </Container>
  );
};

export default SystemPage;
