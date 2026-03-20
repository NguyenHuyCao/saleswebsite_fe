import type { Metadata } from "next";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import "@/styles/app.css";
import AppHeader from "@/views/header/app.header";
import AppFooter from "@/views/footer/app.footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientLayoutWrapper from "@/components/fixed_elements/ClientLayoutWrapper";
import Providers from "@/components/redux/Providers";

export const metadata: Metadata = {
  title: {
    default: "Máy 2 Thì - Cửa hàng Cường Hoa",
    template: "%s | Máy 2 Thì",
  },
  description:
    "Cửa hàng Cường Hoa chuyên cung cấp máy móc 2 thì chính hãng: máy cắt cỏ, máy cưa xích, máy thổi lá. Bảo hành toàn quốc.",
  keywords: ["máy 2 thì", "máy cắt cỏ", "máy cưa xích", "STIHL", "Husqvarna", "Cường Hoa"],
  icons: {
    icon: "/images/store/logo-removebg-preview.png",
  },
  openGraph: {
    siteName: "Máy 2 Thì - Cửa hàng Cường Hoa",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayoutUser({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeRegistry>
        <Providers>
          <AppHeader />
          {children}
          <AppFooter />
        </Providers>
        <ClientLayoutWrapper />
      </ThemeRegistry>
    </>
  );
}
