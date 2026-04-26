// app/product/page.tsx
import type { Metadata } from "next";
import ProductView from "@/features/user/products/ProductView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sản phẩm | Cường Hoa — Máy Công Cụ 2 Thì Chính Hãng",
  description:
    "Mua máy công cụ 2 thì chính hãng tại Cường Hoa: máy cắt cỏ, máy cưa xích, máy phun thuốc, máy thổi lá. Nhiều thương hiệu Honda, Husqvarna, STIHL, Maruyama. Bảo hành toàn quốc.",
  keywords: [
    "mua máy 2 thì",
    "máy cắt cỏ chính hãng",
    "máy cưa xích STIHL",
    "máy cưa xích Husqvarna",
    "máy phun thuốc Honda",
    "máy thổi lá",
    "máy công cụ 2 thì",
    "dụng cụ cơ khí",
    "Cường Hoa",
    "Maruyama",
  ],
  alternates: {
    canonical: "/product",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Sản phẩm | Cường Hoa — Máy Công Cụ 2 Thì",
    description:
      "Máy công cụ 2 thì chính hãng. Giá tốt, bảo hành toàn quốc. Honda, Husqvarna, STIHL, Maruyama.",
    type: "website",
    url: "/product",
    siteName: "Cường Hoa",
    locale: "vi_VN",
    images: [
      {
        url: "/images/banner/banner-ab.jpg",
        width: 1200,
        height: 630,
        alt: "Cường Hoa — Máy Công Cụ 2 Thì Chính Hãng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sản phẩm | Cường Hoa — Máy Công Cụ 2 Thì",
    description:
      "Máy công cụ 2 thì chính hãng. Giá tốt, bảo hành toàn quốc. Honda, Husqvarna, STIHL, Maruyama.",
    images: ["/images/banner/banner-ab.jpg"],
  },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${SITE_URL}/product` },
  ],
};

const WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Sản phẩm — Máy Công Cụ 2 Thì Chính Hãng | Cường Hoa",
  description:
    "Mua máy công cụ 2 thì chính hãng tại Cường Hoa: máy cắt cỏ, máy cưa xích, máy phun thuốc, máy thổi lá.",
  url: `${SITE_URL}/product`,
  publisher: {
    "@type": "Organization",
    name: "Cường Hoa",
    url: SITE_URL,
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
      />
      <ProductView />
    </>
  );
}
