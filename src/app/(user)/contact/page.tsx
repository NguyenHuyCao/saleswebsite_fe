import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import ContactView from "@/features/user/contact/ContactView";

export const metadata: Metadata = {
  title: "Liên hệ | Cường Hoa — Máy Công Cụ 2 Thì Chính Hãng",
  description:
    "Liên hệ Cường Hoa để được tư vấn miễn phí về máy cắt cỏ, máy cưa, máy phát điện 2 thì chính hãng. Hotline: 0392 923 392 — phản hồi trong 24h, 7:00–18:00 mỗi ngày.",
  keywords: [
    "liên hệ Cường Hoa",
    "tư vấn máy 2 thì",
    "hotline máy cắt cỏ",
    "liên hệ máy công cụ",
    "Cường Hoa Bắc Ninh",
    "máy cưa xích",
    "máy phát điện",
    "hỗ trợ kỹ thuật",
  ],
  openGraph: {
    title: "Liên hệ Cường Hoa — Tư vấn máy 2 thì miễn phí",
    description:
      "Gửi yêu cầu tư vấn miễn phí. Đội ngũ Cường Hoa phản hồi trong 24h — 7:00–18:00 mỗi ngày.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "Cường Hoa",
      url: "https://cuonghoa.vn",
      telephone: "+84392923392",
      email: "support@cuonghoa.vn",
      image: "/images/store/logo-removebg-preview.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "293 TL293, Nghĩa Phương",
        addressLocality: "Bắc Ninh",
        addressCountry: "VN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 21.2733,
        longitude: 106.4444,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "18:00",
      },
      sameAs: [
        "https://www.facebook.com/messages/e2ee/t/9200105130025225",
        "https://youtube.com/@cuonghoa",
        "https://zalo.me/0392923392",
      ],
    },
    {
      "@type": "ContactPage",
      name: "Trang liên hệ Cường Hoa",
      description:
        "Gửi yêu cầu tư vấn máy công cụ 2 thì. Đội ngũ Cường Hoa phản hồi trong 24h.",
      url: "https://cuonghoa.vn/contact",
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageViewTracker />
      <ContactView />
    </>
  );
}
