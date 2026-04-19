import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import AboutClient from "@/features/user/about/AboutClient";

export const metadata: Metadata = {
  title: "Giới thiệu | Cường Hoa — Máy Công Cụ 2 Thì Chính Hãng",
  description:
    "Cường Hoa — hơn 5 năm phân phối máy cắt cỏ, máy cưa, máy phát điện 2 thì chính hãng tại Bắc Ninh. Chất lượng bền bỉ, bảo hành 12 tháng, hỗ trợ kỹ thuật trọn đời.",
  keywords: [
    "máy 2 thì",
    "máy cắt cỏ",
    "máy cưa",
    "máy phát điện",
    "Cường Hoa",
    "Bắc Ninh",
    "giới thiệu",
  ],
  openGraph: {
    title: "Giới thiệu Cường Hoa — Máy Công Cụ 2 Thì",
    description:
      "Đơn vị phân phối máy 2 thì chính hãng uy tín tại Bắc Ninh — chất lượng, giá tốt, hậu mãi trọn đời.",
    type: "website",
  },
};

export default function AboutUsPage() {
  return (
    <>
      <PageViewTracker />
      <AboutClient />
    </>
  );
}
