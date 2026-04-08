// app/(user)/new/[slug]/page.tsx
import { Container } from "@mui/material";
import { notFound } from "next/navigation";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { NewsDetailView } from "@/features/user/news";
import type { Metadata } from "next";

// Next.js 15: params là Promise, phải await
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug
      ? `${slug.replace(/-/g, " ")} | Tin tức`
      : "Tin tức",
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

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
