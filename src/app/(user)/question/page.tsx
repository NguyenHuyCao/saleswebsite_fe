// app/question/page.tsx
import type { Metadata } from "next";
import QuestionsView from "@/features/user/questions/QuestionsView";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp | Máy 2 Thì",
  description:
    "Giải đáp thắc mắc về sản phẩm, đặt hàng, thanh toán, bảo hành và giao hàng tại cửa hàng Cường Hoa. Hỗ trợ 24/7.",
  openGraph: {
    title: "Câu hỏi thường gặp | Máy 2 Thì",
    description: "Giải đáp mọi thắc mắc về sản phẩm và dịch vụ. Hỗ trợ 24/7.",
    type: "website",
  },
};

export default function Page() {
  return <QuestionsView />;
}
