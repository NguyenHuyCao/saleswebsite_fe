// system/SystemView.tsx
import { Container, Typography, Box, Chip } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import StoreHeroSection from "./components/StoreHeroSection";
import StoreListSection from "./components/StoreListSection";
import StoreServicesSection from "./components/StoreServicesSection";
import StorePromotionsSection from "./components/StorePromotionsSection";
import StoreFAQSection from "./components/StoreFAQSection";
import { getStoreInfo, getAllStores } from "./api";
import StoreMapView from "./components/StoreMapView";

export default async function SystemView() {
  const [mainStore, allStores] = await Promise.all([
    getStoreInfo(), // Main store
    getAllStores(), // All stores in system
  ]);

  return (
    <>
      <PageViewTracker />

      {/* Hero with main store */}

      <Container sx={{ py: 4 }}>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" fontWeight={800} color="#333" gutterBottom>
            Bản đồ tổng quan
          </Typography>
          <StoreMapView stores={allStores} />
        </Box>
        <StoreHeroSection store={mainStore} />
        {/* Breadcrumb */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Trang chủ / Hệ thống cửa hàng
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 4,
            justifyContent: "center",
          }}
        >
          <Chip
            label={`🏪 ${allStores.length} cửa hàng trên toàn quốc`}
            sx={{ bgcolor: "#f25c05", color: "#fff", px: 2 }}
          />
          <Chip
            label="📍 Phủ sóng 63 tỉnh thành"
            sx={{ bgcolor: "#ffb700", color: "#000", px: 2 }}
          />
          <Chip
            label="🕒 Mở cửa 8:00 - 17:30"
            sx={{ bgcolor: "#4caf50", color: "#fff", px: 2 }}
          />
        </Box>

        {/* Store Locator Section */}
        <StoreListSection stores={allStores} />

        {/* Services Section */}
        <StoreServicesSection />

        {/* Promotions Section */}
        <StorePromotionsSection store={mainStore} />

        {/* FAQ Section */}
        <StoreFAQSection />
      </Container>
    </>
  );
}
