import ExperienceMediaSection from "@/components/about/ExperienceMediaSection";
import FinalCallToActionSection from "@/components/about/FinalCallToActionSection";
import HeroSection from "@/components/about/HeroSection";
import SupportCommitmentsSection from "@/components/about/SupportCommitmentsSection";
import TestimonialsSection from "@/components/about/TestimonialsSection";
import WhoWeAre from "@/components/about/WhoWeAre";
import WhyTwoStrokeSection from "@/components/about/WhyTwoStrokeSection";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";

const AboutUsPage = () => {
  return (
    <>
      <PageViewTracker />
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
};

export default AboutUsPage;
