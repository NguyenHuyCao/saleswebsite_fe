// app/promotion/page.tsx
import type { Metadata } from "next";
import PromotionView from "@/features/user/promotion/PromotionView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Khuyến Mãi | Cường Hoa — Flash Sale Máy Công Cụ 2 Thì",
  description:
    "Flash sale và ưu đãi đặc biệt máy công cụ 2 thì tại Cường Hoa. Giảm giá máy cắt cỏ, máy cưa xích, máy phun thuốc Honda, Husqvarna, STIHL. Số lượng có hạn — mua ngay!",
  keywords: [
    "khuyến mãi máy 2 thì",
    "flash sale máy cắt cỏ",
    "giảm giá máy cưa xích",
    "ưu đãi máy công cụ",
    "Cường Hoa khuyến mãi",
    "máy STIHL giảm giá",
    "máy Honda flash sale",
    "flash sale máy công cụ chính hãng",
  ],
  alternates: {
    canonical: "/promotion",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Khuyến Mãi | Cường Hoa — Flash Sale Máy Công Cụ 2 Thì",
    description:
      "Flash sale máy công cụ 2 thì chính hãng. Giảm giá khủng, số lượng có hạn. Honda, Husqvarna, STIHL, Maruyama.",
    type: "website",
    url: "/promotion",
    siteName: "Cường Hoa",
    locale: "vi_VN",
    images: [
      {
        url: "/images/banner/banner-ab.jpg",
        width: 1200,
        height: 630,
        alt: "Flash Sale Máy Công Cụ 2 Thì — Cường Hoa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khuyến Mãi | Cường Hoa — Flash Sale Máy Công Cụ 2 Thì",
    description:
      "Flash sale máy công cụ 2 thì chính hãng. Giảm giá khủng, số lượng có hạn.",
    images: ["/images/banner/banner-ab.jpg"],
  },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Khuyến mãi", item: `${SITE_URL}/promotion` },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Làm thế nào để áp dụng mã khuyến mãi tại Cường Hoa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nhập mã khuyến mãi tại bước thanh toán trong giỏ hàng. Với Flash Sale, ưu đãi được áp dụng tự động, không cần nhập mã.",
      },
    },
    {
      "@type": "Question",
      name: "Flash Sale có áp dụng cho tất cả sản phẩm không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flash Sale chỉ áp dụng cho các sản phẩm được chọn trong từng chương trình. Xem danh sách sản phẩm cụ thể tại mỗi chương trình Flash Sale trên trang Khuyến Mãi.",
      },
    },
    {
      "@type": "Question",
      name: "Chương trình khuyến mãi có được cộng dồn không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Các chương trình Flash Sale không cộng dồn với nhau. Tuy nhiên, một số ưu đãi đặc biệt có thể kết hợp với chương trình khách hàng thân thiết.",
      },
    },
  ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <PromotionView />
    </>
  );
}
