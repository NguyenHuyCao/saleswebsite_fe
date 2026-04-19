import type { Metadata } from "next";
import ReduxProvider from "@/components/redux/Providers";
import RootProviders from "./providers";
import { quicksand } from "./fonts";
import { ReactNode } from "react";
import {
  STORE_FULL_NAME,
  STORE_DESCRIPTION,
  STORE_SEO_KEYWORDS,
  STORE_PHONE,
  STORE_ADDRESS,
  STORE_EMAIL,
} from "@/lib/constants/store";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn"
  ),
  title: {
    default: `${STORE_FULL_NAME} – Bắc Ninh`,
    template: `%s | ${STORE_FULL_NAME}`,
  },
  description: STORE_DESCRIPTION,
  keywords: STORE_SEO_KEYWORDS,
  authors: [{ name: "Cường Hoa" }],
  creator: "Cường Hoa",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: STORE_FULL_NAME,
    title: `${STORE_FULL_NAME} – Máy 2 Thì Chính Hãng`,
    description: STORE_DESCRIPTION,
    images: [
      {
        url: "/images/store/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Cửa hàng máy 2 thì Cường Hoa – Bắc Ninh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE_FULL_NAME} – Máy 2 Thì Chính Hãng`,
    description: STORE_DESCRIPTION,
    images: ["/images/store/og-banner.jpg"],
  },
  icons: {
    icon: "/images/store/logo-removebg-preview.png",
    shortcut: "/images/store/logo-removebg-preview.png",
    apple: "/images/store/logo-removebg-preview.png",
  },
};

/** JSON-LD LocalBusiness schema — helps Google show rich results */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: STORE_FULL_NAME,
  description: STORE_DESCRIPTION,
  telephone: STORE_PHONE,
  email: STORE_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "293 TL293",
    addressLocality: "Nghĩa Phương",
    addressRegion: "Bắc Ninh",
    addressCountry: "VN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
      ],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "07:00",
      closes: "17:00",
    },
  ],
  priceRange: "₫₫",
  servesCuisine: null,
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={quicksand.className}>
        <ReduxProvider>
          <RootProviders>{children}</RootProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}
