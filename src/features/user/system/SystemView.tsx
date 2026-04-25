import {
  Container,
  Typography,
  Box,
  Chip,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import StoreHeroSection from "./components/StoreHeroSection";
import StoreListSection from "./components/StoreListSection";
import StoreServicesSection from "./components/StoreServicesSection";
import StorePromotionsSection from "./components/StorePromotionsSection";
import StoreFAQSection from "./components/StoreFAQSection";
import StoreMapView from "./components/StoreMapView";
import { getStoreInfo, getAllStores } from "./api";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default async function SystemView() {
  const [mainStore, allStores] = await Promise.all([
    getStoreInfo(),
    getAllStores(),
  ]);

  return (
    <>
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <Box
        component="section"
        sx={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 60%, #3a1a00 100%)",
          py: { xs: 6, md: 8 },
          px: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(242,92,5,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems={{ xs: "center", md: "flex-start" }}>
            <Chip
              icon={<StorefrontIcon sx={{ fontSize: "1rem !important" }} />}
              label="Hệ thống cửa hàng"
              sx={{ bgcolor: "rgba(242,92,5,0.2)", color: "#ffb700", fontWeight: 700, border: "1px solid rgba(242,92,5,0.4)" }}
            />
            <Typography
              component="h1"
              fontWeight={900}
              sx={{
                fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
                color: "#fff",
                lineHeight: 1.2,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Chuỗi cửa hàng
              <Box component="span" sx={{ color: "#f25c05", display: "block" }}>
                Máy 2 Thì Cường Hoa
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.75)",
                maxWidth: 560,
                textAlign: { xs: "center", md: "left" },
                lineHeight: 1.7,
              }}
            >
              Ghé showroom để trải nghiệm trực tiếp và nhận tư vấn chuyên sâu từ đội ngũ kỹ thuật
              tại{" "}
              <Box component="span" sx={{ color: "#ffb700", fontWeight: 600 }}>
                293 TL293, Nghĩa Phương, Bắc Ninh
              </Box>
            </Typography>

            {/* Quick stats */}
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ pt: 1, gap: 1 }}>
              {[
                { icon: <StorefrontIcon sx={{ fontSize: 16 }} />, text: `${allStores.length} cửa hàng` },
                { icon: <LocationOnIcon sx={{ fontSize: 16 }} />, text: "Bắc Ninh" },
                { icon: <AccessTimeIcon sx={{ fontSize: 16 }} />, text: `${mainStore.hours.monday} mỗi ngày` },
                { icon: <StarIcon sx={{ fontSize: 16 }} />, text: `${mainStore.rating}/5 (${mainStore.totalRatings} đánh giá)` },
              ].map((stat) => (
                <Chip
                  key={stat.text}
                  icon={stat.icon}
                  label={stat.text}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>

        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 4, "& .MuiBreadcrumbs-separator": { color: "#ccc" } }}
        >
          <Link
            href="/"
            underline="hover"
            sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", fontSize: "0.875rem" }}
          >
            <HomeIcon sx={{ fontSize: 16 }} />
            Trang chủ
          </Link>
          <Typography color="#f25c05" fontWeight={600} fontSize="0.875rem">
            Hệ thống cửa hàng
          </Typography>
        </Breadcrumbs>

        {/* ── Chi tiết cửa hàng chính ──────────────────────────────────── */}
        <StoreHeroSection store={mainStore} />

        {/* ── Bản đồ tổng quan ─────────────────────────────────────────── */}
        <Box component="section" sx={{ mt: 6 }}>
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography component="h2" variant="h5" fontWeight={800} color="#333">
              Bản đồ tổng quan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Xem vị trí và chỉ đường đến cửa hàng
            </Typography>
          </Stack>
          <StoreMapView stores={allStores} />
        </Box>

        {/* ── Danh sách & tìm kiếm cửa hàng ───────────────────────────── */}
        <Box component="section">
          <StoreListSection stores={allStores} />
        </Box>

        {/* ── Dịch vụ ──────────────────────────────────────────────────── */}
        <Box component="section">
          <StoreServicesSection />
        </Box>

        {/* ── Khuyến mãi ───────────────────────────────────────────────── */}
        <Box component="section">
          <StorePromotionsSection store={mainStore} />
        </Box>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <Box component="section">
          <StoreFAQSection />
        </Box>

      </Container>
    </>
  );
}
