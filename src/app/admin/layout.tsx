import "@/styles/app.css";

import UserLayout from "@/components/layouts/UserLayout";
import AdminProviders from "@/components/providers/admin-providers";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị - Cửa hàng Cường Hoa",
  description: "Trang quản trị cửa hàng Cường Hoa",
  icons: {
    icon: "/images/store/logo-removebg-preview.png",
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProviders>
      <UserLayout>{children}</UserLayout>
    </AdminProviders>
  );
}
