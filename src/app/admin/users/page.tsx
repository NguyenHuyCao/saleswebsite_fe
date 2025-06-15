"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load client component
const ClientOnlyUsersPage = dynamic(
  () => import("@/views/admin/user/ClientOnlyUsersPage"),
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientOnlyUsersPage />
    </Suspense>
  );
}
