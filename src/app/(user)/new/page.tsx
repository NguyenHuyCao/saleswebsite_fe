import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { NewsListView } from "@/features/user/news";
import { Container } from "@mui/material";

export const metadata: Metadata = {
  title: "Tin tức | Máy 2 Thì",
  description:
    "Tin tức mới nhất về máy 2 thì, đánh giá sản phẩm, kinh nghiệm sử dụng máy cắt cỏ, máy cưa xích và dụng cụ cơ khí.",
  openGraph: {
    title: "Tin tức | Máy 2 Thì",
    description: "Đánh giá, kinh nghiệm và thông tin mới nhất về máy 2 thì.",
    type: "website",
  },
};

export default function NewPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageViewTracker />
      <NewsListView />
    </Container>
  );
}
