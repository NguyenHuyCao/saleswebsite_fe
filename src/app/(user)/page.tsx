import type { Metadata } from "next";
import HomeView from "@/features/user/home/HomeView";

export const metadata: Metadata = {
  title: "Trang chủ | Máy 2 Thì - Cửa hàng Cường Hoa",
  description:
    "Cửa hàng Cường Hoa chuyên cung cấp máy móc 2 thì chính hãng: máy cắt cỏ, máy cưa xích, máy thổi lá STIHL, Husqvarna. Bảo hành chính hãng, giao hàng toàn quốc.",
  keywords: ["máy 2 thì", "máy cắt cỏ", "máy cưa xích", "STIHL", "Husqvarna", "Cường Hoa"],
  openGraph: {
    title: "Máy 2 Thì - Cửa hàng Cường Hoa",
    description:
      "Chuyên cung cấp máy móc 2 thì chính hãng. Bảo hành toàn quốc.",
    type: "website",
  },
};

export default function Page() {
  return <HomeView />;
}
