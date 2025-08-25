import "@/styles/app.css";

import UserLayout from "@/components/layouts/UserLayout";
import { ReactNode } from "react";
import { Metadata } from "next";
import AppProviders from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "Cửa hàng Cường Hoa",
  description: "Chào mừng bạn đến với cửa hàng Cường Hoa",
  icons: {
    icon: "/images/store/logo-removebg-preview.png",
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <Provider store={store}> */}
      <UserLayout>
        <AppProviders>{children}</AppProviders>
      </UserLayout>
      {/* </Provider> */}
    </>
  );
}
