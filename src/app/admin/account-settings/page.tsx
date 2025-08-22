"use client";
import dynamic from "next/dynamic";

// Tắt SSR vì form dùng localStorage token + chỉ chạy client
const AccountSettings = dynamic(
  () => import("@/features/account/components/AccountSettings"),
  { ssr: false }
);

export default function Page() {
  return <AccountSettings />;
}
