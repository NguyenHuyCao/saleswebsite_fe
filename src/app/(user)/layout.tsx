import type { Metadata } from "next";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import "@/styles/app.css";
import NprogressWrapper from "@/lib/nprogress.wrapper";
import { Quicksand } from "next/font/google";
import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

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
    <html lang="en">
      <body className={quicksand.className}>
        <ThemeRegistry>
          <NprogressWrapper>
            <AppHeader />
            {children}
            <AppFooter />
          </NprogressWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
