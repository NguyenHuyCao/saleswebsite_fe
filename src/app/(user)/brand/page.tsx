import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import BrandView from "@/features/user/brand/BrandView";

export const metadata: Metadata = {
  title: "Thương hiệu chính hãng | Cường Hoa — Máy Công Cụ 2 Thì",
  description:
    "Khám phá các thương hiệu máy công cụ 2 thì chính hãng tại Cường Hoa: Honda, Husqvarna, STIHL, Maruyama, Kawasaki, Robin... Nhập khẩu trực tiếp, bảo hành toàn quốc.",
  keywords: ["thương hiệu máy 2 thì", "Honda", "Husqvarna", "STIHL", "Maruyama", "máy cắt cỏ chính hãng", "Cường Hoa"],
  openGraph: {
    title: "Thương hiệu chính hãng | Cường Hoa",
    description: "Phân phối chính thức máy công cụ 2 thì từ các thương hiệu hàng đầu thế giới.",
    type: "website",
  },
};

export default function BrandPage() {
  return (
    <>
      <PageViewTracker />
      <BrandView />
    </>
  );
}
