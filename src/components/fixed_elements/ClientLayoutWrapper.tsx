"use client";

import FloatingContactButtons from "./button_contact/FloatingContactButton";
import WarrantyAndFAQButtons from "./warranty_aquestion/WarrantyAndFAQButtons";
import AiChatWidget from "./AiChatWidget";

const ClientLayoutWrapper = () => {
  return (
    <>
      <FloatingContactButtons />
      <WarrantyAndFAQButtons />
      <AiChatWidget />
    </>
  );
};

export default ClientLayoutWrapper;
