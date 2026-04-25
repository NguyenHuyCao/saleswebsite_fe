import type { Metadata } from "next";
import QuestionsView from "@/features/user/questions/QuestionsView";
import { faqData } from "@/features/user/questions/constants/faqData";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp | Cường Hoa — Máy Công Cụ 2 Thì",
  description:
    "Giải đáp thắc mắc về sản phẩm, đặt hàng, thanh toán, bảo hành và giao hàng tại Cường Hoa. Hotline hỗ trợ: 0392 923 392.",
  keywords: [
    "câu hỏi thường gặp Cường Hoa",
    "FAQ máy 2 thì",
    "hỗ trợ khách hàng",
    "bảo hành máy cắt cỏ",
    "chính sách đổi trả",
    "giao hàng máy công cụ",
  ],
  openGraph: {
    title: "Câu hỏi thường gặp | Cường Hoa",
    description: "Giải đáp mọi thắc mắc về sản phẩm và dịch vụ Cường Hoa. Hotline: 0392 923 392.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.flatMap((cat) =>
    cat.questions.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.a,
      },
    }))
  ),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuestionsView />
    </>
  );
}
