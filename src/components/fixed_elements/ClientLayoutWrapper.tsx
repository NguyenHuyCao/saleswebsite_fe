"use client";

import { useState } from "react";
import FloatingContactButtons from "./button_contact/FloatingContactButton";
import WarrantyAndFAQButtons from "./warranty_aquestion/WarrantyAndFAQButtons";
import AiChatWidget from "./AiChatWidget";
import CompareFloatingBar from "@/features/user/products/components/CompareFloatingBar";

const ClientLayoutWrapper = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <FloatingContactButtons hidden={chatOpen} />
      <WarrantyAndFAQButtons hidden={chatOpen} />
      <AiChatWidget onChatOpenChange={setChatOpen} />
      <CompareFloatingBar />
    </>
  );
};

export default ClientLayoutWrapper;
