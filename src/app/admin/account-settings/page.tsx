"use client";

import dynamic from "next/dynamic";

const ClientOnlyAccountPage = dynamic(
  () => import("@/views/admin/account/ClientOnlyAccountPage"),
  { ssr: false }
);

const AccountPage = () => {
  return <ClientOnlyAccountPage />;
};

export default AccountPage;
