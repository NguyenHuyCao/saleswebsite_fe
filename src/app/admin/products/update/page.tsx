"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Bắt buộc dùng ssr: false + Suspense để tránh prerender lỗi
const ClientOnlyUpdateProduct = dynamic(
  () => import("@/views/admin/product/update/ClientOnlyUpdateProduct"),
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientOnlyUpdateProduct />
    </Suspense>
  );
}
