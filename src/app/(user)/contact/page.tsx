import ContactFormSection from "@/components/contact/ContactFormSection";
import ContactHeroSection from "@/components/contact/ContactHeroSection";
import ContactInfoMapSection from "@/components/contact/ContactInfoMapSection";
import FinalCallToAction from "@/components/contact/FinalCallToAction";
import QuickHelpSection from "@/components/contact/QuickHelpSection";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";

const ContactPage = () => {
  return (
    <>
      <PageViewTracker />
      <ContactHeroSection />
      <Container>
        <ContactFormSection />
        <ContactInfoMapSection />
        <QuickHelpSection />
      </Container>
      <FinalCallToAction />
    </>
  );
};

export default ContactPage;
