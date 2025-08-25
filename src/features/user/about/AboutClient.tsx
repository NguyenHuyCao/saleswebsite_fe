"use client";

import dynamic from "next/dynamic";
import { Container } from "@mui/material";

// Phần nhẹ có thể import thẳng
import WhoWeAre from "@/features/about/components/WhoWeAre";
import WhyTwoStrokeSection from "@/features/about/components/WhyTwoStrokeSection";
import SupportCommitmentsSection from "@/features/about/components/SupportCommitmentsSection";
import FinalCallToActionSection from "@/features/about/components/FinalCallToActionSection";

// Phần nặng (chỉ chạy client, tách bundle)
const HeroSection = dynamic(
  () => import("@/features/about/components/HeroSection"),
  { ssr: false }
);
const ExperienceMediaSection = dynamic(
  () => import("@/features/about/components/ExperienceMediaSection"),
  { ssr: false }
);
const TestimonialsSection = dynamic(
  () => import("@/features/about/components/TestimonialsSection"),
  { ssr: false }
);

export default function AboutClient() {
  return (
    <>
      <HeroSection />
      <Container>
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
