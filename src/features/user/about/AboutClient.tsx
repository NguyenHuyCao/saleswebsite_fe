"use client";

import dynamic from "next/dynamic";
import { Container, Skeleton, Box } from "@mui/material";

// Static imports — bundled in main chunk (no framer-motion, no CSR-only APIs)
import WhoWeAre from "./components/WhoWeAre";
import WhyTwoStrokeSection from "./components/WhyTwoStrokeSection";
import SupportCommitmentsSection from "./components/SupportCommitmentsSection";
import BrandPartnersSection from "./components/BrandPartnersSection";
import StoreJourneySection from "./components/StoreJourneySection";
import StoreInfoSection from "./components/StoreInfoSection";
import FinalCallToActionSection from "./components/FinalCallToActionSection";

// Dynamic — CSR only (uses browser APIs, lightbox, slick slider, or had framer-motion)
const HeroSection = dynamic(() => import("./components/HeroSection"), {
  ssr: false,
  loading: () => (
    <Skeleton variant="rectangular" width="100%" height={560} animation="wave" />
  ),
});

const ExperienceMediaSection = dynamic(
  () => import("./components/ExperienceMediaSection"),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} animation="wave" />
      </Box>
    ),
  },
);

const TestimonialsSection = dynamic(
  () => import("./components/TestimonialsSection"),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ py: 4 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mx: "auto", mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={220} animation="wave" />
      </Box>
    ),
  },
);

export default function AboutClient() {
  return (
    <>
      {/* Full-width hero — outside container */}
      <HeroSection />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Ai chúng tôi + giá trị cốt lõi */}
        <WhoWeAre />

        {/* Lợi ích máy 2 thì */}
        <WhyTwoStrokeSection />

        {/* Hành trình phát triển */}
        <StoreJourneySection />

        {/* Hình ảnh & video thực tế */}
        <ExperienceMediaSection />

        {/* Thương hiệu phân phối */}
        <BrandPartnersSection />

        {/* Cam kết & hỗ trợ */}
        <SupportCommitmentsSection />

        {/* Khách hàng nói gì */}
        <TestimonialsSection />

        {/* Thông tin cửa hàng & bản đồ */}
        <StoreInfoSection />
      </Container>

      {/* CTA — full width feel via Container */}
      <FinalCallToActionSection />
    </>
  );
}
