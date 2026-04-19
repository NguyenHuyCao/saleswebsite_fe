"use client";

import dynamic from "next/dynamic";
import { Container, Skeleton, Box } from "@mui/material";

// Nhẹ: import thẳng
import WhoWeAre from "./components/WhoWeAre";
import WhyTwoStrokeSection from "./components/WhyTwoStrokeSection";
import SupportCommitmentsSection from "./components/SupportCommitmentsSection";
import FinalCallToActionSection from "./components/FinalCallToActionSection";

// Nặng/CSR-only — có loading skeleton để tránh layout shift
const HeroSection = dynamic(() => import("./components/HeroSection"), {
  ssr: false,
  loading: () => (
    <Skeleton variant="rectangular" width="100%" height={550} animation="wave" />
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
  }
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
  }
);

// (tùy chọn) nếu muốn lấy content động:
// import { AboutQueries } from ".";
// const { data } = AboutQueries.useAboutContent();

export default function AboutClient() {
  return (
    <>
      <HeroSection />
      <Container maxWidth="lg">
        <WhoWeAre />
        <WhyTwoStrokeSection />
        <ExperienceMediaSection />
        <TestimonialsSection />
        <SupportCommitmentsSection />
        <FinalCallToActionSection />
      </Container>
    </>
  );
}
