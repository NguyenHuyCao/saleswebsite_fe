"use client";

import FloatingContactButtons from "./button_contact/FloatingContactButton";
import WarrantyAndFAQButtons from "./warranty_aquestion/WarrantyAndFAQButtons";

const ClientLayoutWrapper = () => {
  return (
    <>
      <FloatingContactButtons />
      <WarrantyAndFAQButtons />
    </>
  );
};

export default ClientLayoutWrapper;
