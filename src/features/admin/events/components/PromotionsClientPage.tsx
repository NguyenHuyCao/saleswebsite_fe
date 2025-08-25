"use client";

import { useSearchParams } from "next/navigation";
import PromotionsList from "./PromotionsList";
import PromotionForm from "./PromotionForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function PromotionsClientPage() {
  const sp = useSearchParams();
  const action = sp.get("action");
  const id = sp.get("id") || undefined;

  if (action === "add" || action === "edit") {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PromotionForm mode={action === "edit" ? "edit" : "create"} id={id} />
      </LocalizationProvider>
    );
  }

  return <PromotionsList />;
}
