"use client";

import dynamic from "next/dynamic";
import { Container } from "@mui/material";

// Nhẹ: import thẳng
import WhoWeAre from "./components/WhoWeAre";
import WhyTwoStrokeSection from "./components/WhyTwoStrokeSection";
import SupportCommitmentsSection from "./components/SupportCommitmentsSection";
import FinalCallToActionSection from "./components/FinalCallToActionSection";

// Nặng/CSR-only
const HeroSection = dynamic(() => import("./components/HeroSection"), {
  ssr: false,
});
const ExperienceMediaSection = dynamic(
  () => import("./components/ExperienceMediaSection"),
  { ssr: false }
);
const TestimonialsSection = dynamic(
  () => import("./components/TestimonialsSection"),
  { ssr: false }
);

// (tùy chọn) nếu muốn lấy content động:
// import { AboutQueries } from ".";
// const { data } = AboutQueries.useAboutContent();

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
