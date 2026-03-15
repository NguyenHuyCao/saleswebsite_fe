// app/(user)/new/[slug]/page.tsx
import { Container } from "@mui/material";
import { notFound } from "next/navigation";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { NewsDetailView } from "@/features/user/news";

interface Props {
  params: {
    slug: string;
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageViewTracker />
      <NewsDetailView slug={slug} />
    </Container>
  );
}
