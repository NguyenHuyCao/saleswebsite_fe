"use client";
import dynamic from "next/dynamic";

const ClientOrdersPage = dynamic(
  () => import("@/views/admin/order/ClientOrdersPage"),
  { ssr: false }
);

export default function OrdersPage() {
  return <ClientOrdersPage />;
}
