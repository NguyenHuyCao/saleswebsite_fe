"use client";

import { useSearchParams } from "next/navigation";
import PromotionFormPage from "@/views/admin/event/PromotionFormPage";
import PromotionListPage from "@/views/admin/event/PromotionListPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const PromotionPage = () => {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  if (action === "add" || action === "edit") {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PromotionFormPage />
      </LocalizationProvider>
    );
  }

  return <PromotionListPage />;
};

export default PromotionPage;
