"use client";

import dynamic from "next/dynamic";

// Form dùng localStorage token ⇒ tắt SSR
const AccountSettings = dynamic(
  () => import("@/features/admin/account/components/AccountSettings"),
  { ssr: false }
);

export default function Page() {
  return <AccountSettings />;
}
