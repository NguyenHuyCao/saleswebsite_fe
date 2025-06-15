"use client";

import dynamic from "next/dynamic";

const AddProductPage = dynamic(
  () => import("@/views/admin/product/create/AddProductPage"),
  { ssr: false }
);

export default function Page() {
  return <AddProductPage />;
}
