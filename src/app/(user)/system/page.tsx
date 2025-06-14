import StoreHeroSection from "@/components/system/SystemStore";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";

const SystemPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <StoreHeroSection />
    </Container>
  );
};

export default SystemPage;
