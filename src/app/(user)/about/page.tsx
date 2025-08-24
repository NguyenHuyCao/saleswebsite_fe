import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import AboutClient from "@/features/about/AboutClient";

export const metadata: Metadata = {
  title: "Về chúng tôi | Máy 2 Thì",
  description:
    "Chất lượng bền bỉ, hậu mãi trọn đời. Tìm hiểu về đội ngũ và cam kết của chúng tôi.",
};

export default function AboutUsPage() {
  return (
    <>
      <PageViewTracker />
      <AboutClient />
    </>
  );
}
