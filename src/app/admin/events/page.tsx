"use client";

import dynamic from "next/dynamic";

const ClientOnlyPromotionPage = dynamic(
  () => import("@/views/admin/event/ClientOnlyPromotionPage"),
  { ssr: false }
);

export default function Page() {
  return <ClientOnlyPromotionPage />;
}
