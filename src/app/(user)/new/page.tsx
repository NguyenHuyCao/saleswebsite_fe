// app/(user)/new/page.tsx
import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { NewsListView } from "@/features/user/news";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tin tức | Cường Hoa — Kiến thức máy công cụ 2 thì",
  description:
    "Tin tức mới nhất về máy công cụ 2 thì: đánh giá sản phẩm, hướng dẫn sử dụng, kinh nghiệm chọn máy cắt cỏ, máy cưa xích, máy phun thuốc tại Cường Hoa.",
  keywords: [
    "tin tức máy 2 thì",
    "kiến thức máy cắt cỏ",
    "đánh giá máy cưa xích STIHL",
    "hướng dẫn sử dụng máy công cụ",
    "Cường Hoa tin tức",
    "kinh nghiệm mua máy cắt cỏ",
  ],
  alternates: { canonical: "/new" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: "Tin tức | Cường Hoa — Kiến thức máy công cụ 2 thì",
    description:
      "Kiến thức, đánh giá và hướng dẫn sử dụng máy công cụ 2 thì chính hãng từ đội ngũ chuyên gia Cường Hoa.",
    type: "website",
    url: "/new",
    siteName: "Cường Hoa",
    locale: "vi_VN",
    images: [
      {
        url: "/images/banner/banner-ab.jpg",
        width: 1200,
        height: 630,
        alt: "Tin tức máy công cụ 2 thì — Cường Hoa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tin tức | Cường Hoa — Kiến thức máy công cụ 2 thì",
    description: "Kiến thức, đánh giá và hướng dẫn sử dụng máy công cụ 2 thì chính hãng.",
    images: ["/images/banner/banner-ab.jpg"],
  },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Tin tức", item: `${SITE_URL}/new` },
  ],
};

const WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Tin tức — Kiến thức máy công cụ 2 thì | Cường Hoa",
  description:
    "Tin tức, đánh giá sản phẩm và hướng dẫn sử dụng máy công cụ 2 thì chính hãng tại Cường Hoa.",
  url: `${SITE_URL}/new`,
  publisher: { "@type": "Organization", name: "Cường Hoa", url: SITE_URL },
};

export default function NewPage() {
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
      <PageViewTracker />
      <NewsListView />
    </>
  );
}
