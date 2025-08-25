"use client";

import { Container } from "@mui/material";
import ContactHeroSection from "./components/ContactHeroSection";
import ContactFormSection from "./components/ContactFormSection";
import ContactInfoMapSection from "./components/ContactInfoMapSection";
import QuickHelpSection from "./components/QuickHelpSection";
import FinalCallToAction from "./components/FinalCallToAction";

export default function ContactView() {
  return (
    <>
      <ContactHeroSection />
      <Container>
        <ContactFormSection />
        <ContactInfoMapSection />
        <QuickHelpSection />
      </Container>
      <FinalCallToAction />
    </>
  );
}
