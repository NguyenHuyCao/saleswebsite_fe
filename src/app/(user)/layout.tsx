import type { Metadata } from "next";
import ThemeRegistry from "@/views/theme-registry/theme.registry";
import "@/styles/app.css";
// import { Quicksand } from "next/font/google";
import AppHeader from "@/views/header/app.header";
import AppFooter from "@/views/footer/app.footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import FloatingContactButtons from "@/components/FloatingContactButton";

// const quicksand = Quicksand({
//   subsets: ["latin"],
//   weight: ["400", "500", "700"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Cửa hàng Cường Hoa",
  description: "Chào mừng bạn đến với cửa hàng Cường Hoa",
  icons: {
    icon: "/images/store/logo-removebg-preview.png", // hoặc '/favicon.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeRegistry>
      <AppHeader />
      {children}
      <AppFooter />
      <FloatingContactButtons />
      <ScrollToTopButton />
    </ThemeRegistry>
  );
}
