"use client";

import FloatingContactButtons from "./button_contact/FloatingContactButton";
// import ScrollToTopButton from "./button_scroll_to_top/ScrollToTopButton";
import WarrantyAndFAQButtons from "./warranty_aquestion/WarrantyAndFAQButtons";

const ClientLayoutWrapper = () => {
  return (
    <>
      <FloatingContactButtons />

      {/* <ScrollToTopButton /> */}
      <WarrantyAndFAQButtons />
    </>
  );
};

export default ClientLayoutWrapper;
