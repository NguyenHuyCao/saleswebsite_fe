// app/product/page.tsx
import type { Metadata } from "next";
import ProductView from "@/features/user/products/ProductView";

export const metadata: Metadata = {
  title: "Sản phẩm | Máy 2 Thì",
  description:
    "Danh sách đầy đủ máy 2 thì: máy cắt cỏ, máy cưa xích, máy khoan, máy mài, máy thổi lá. Nhiều thương hiệu chính hãng, giá tốt, bảo hành dài hạn.",
  keywords: ["mua máy 2 thì", "máy cắt cỏ chính hãng", "máy cưa xích STIHL", "dụng cụ cơ khí"],
  openGraph: {
    title: "Sản phẩm | Máy 2 Thì",
    description: "Danh sách máy 2 thì chính hãng. Giá tốt, bảo hành dài hạn.",
    type: "website",
  },
};

export default function Page() {
  return <ProductView />;
}
