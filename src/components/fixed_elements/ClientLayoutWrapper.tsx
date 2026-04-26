"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import FloatingContactButtons from "./button_contact/FloatingContactButton";
import WarrantyAndFAQButtons from "./warranty_aquestion/WarrantyAndFAQButtons";
import AiChatWidget from "./AiChatWidget";
import CompareFloatingBar from "@/features/user/products/components/CompareFloatingBar";

// Pages where the mobile checkout bar is shown — FABs on the left would overlap it
const CART_PAGES = ["/cart"];

const ClientLayoutWrapper = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const pathname = usePathname();
  const isCartPage = CART_PAGES.includes(pathname);

  return (
    <>
      <FloatingContactButtons hidden={chatOpen || isCartPage} />
      <WarrantyAndFAQButtons hidden={chatOpen || isCartPage} />
      <AiChatWidget onChatOpenChange={setChatOpen} />
      <CompareFloatingBar />
    </>
  );
};

export default ClientLayoutWrapper;
