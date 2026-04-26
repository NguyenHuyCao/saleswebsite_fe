import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import SystemView from "@/features/user/system/SystemView";

export const metadata: Metadata = {
  title: "Hệ thống cửa hàng | Cường Hoa — Máy Công Cụ 2 Thì",
  description:
    "Tìm cửa hàng Cường Hoa gần nhất. Showroom tại 293 TL293, Nghĩa Phương, Bắc Ninh — mở cửa 7:00–18:00 mỗi ngày. Tư vấn, trải nghiệm và mua máy 2 thì chính hãng trực tiếp.",
  keywords: [
    "cửa hàng Cường Hoa",
    "showroom máy 2 thì Bắc Ninh",
    "địa chỉ cửa hàng máy cắt cỏ",
    "tìm cửa hàng gần tôi",
    "hệ thống cửa hàng",
    "cửa hàng máy cưa xích Bắc Ninh",
  ],
  openGraph: {
    title: "Hệ thống cửa hàng Cường Hoa",
    description:
      "Ghé showroom 293 TL293, Nghĩa Phương, Bắc Ninh để trải nghiệm máy 2 thì chính hãng trực tiếp.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Cửa hàng máy 2 thì Cường Hoa",
  description:
    "Chuyên cung cấp máy cắt cỏ, máy cưa xích, máy thổi lá và các thiết bị động cơ 2 thì chính hãng tại Bắc Ninh.",
  url: "https://cuonghoa.vn/system",
  telephone: "+84-392-923-392",
  email: "support@cuonghoa.vn",
  address: {
    "@type": "PostalAddress",
    streetAddress: "293 TL293",
    addressLocality: "Nghĩa Phương, Lương Tài",
    addressRegion: "Bắc Ninh",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 21.274,
    longitude: 106.4871,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "07:00",
      closes: "17:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "180",
  },
};

export default function SystemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageViewTracker />
      <SystemView />
    </>
  );
}
