import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import BrandView from "@/features/brand/BrandView";

export const metadata: Metadata = {
  title: "Thương hiệu | Máy 2 Thì",
  description:
    "Danh sách thương hiệu chính hãng, nhập khẩu trực tiếp, bảo hành toàn quốc.",
};

export default function BrandPage() {
  return (
    <>
      <PageViewTracker />
      <BrandView />
    </>
  );
}
