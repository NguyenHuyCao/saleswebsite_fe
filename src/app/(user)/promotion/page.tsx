// app/promotion/page.tsx
import type { Metadata } from "next";
import PromotionView from "@/features/user/promotion/PromotionView";

export const metadata: Metadata = {
  title: "Khuyến mãi | Máy 2 Thì",
  description:
    "Chương trình khuyến mãi, flash sale và ưu đãi đặc biệt tại cửa hàng Cường Hoa. Máy 2 thì giá tốt nhất.",
  openGraph: {
    title: "Khuyến mãi | Máy 2 Thì",
    description: "Flash sale và ưu đãi đặc biệt máy 2 thì chính hãng.",
    type: "website",
  },
};

export default function Page() {
  return <PromotionView />;
}
