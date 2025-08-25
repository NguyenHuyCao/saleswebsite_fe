// system/SystemView.tsx
import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import StoreHeroSection from "./components/StoreHeroSection";
import { getStoreInfo } from "./api";

export default async function SystemView() {
  const store = await getStoreInfo();
  return (
    <Container>
      <PageViewTracker />
      <StoreHeroSection store={store} />
    </Container>
  );
}
