// app/(user)/new/[slug]/page.tsx
import { notFound } from "next/navigation";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { NewsDetailView } from "@/features/user/news";
import { getNewsBySlug } from "@/features/user/news/api";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn";

function stripHtml(html?: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return { title: "Tin tức | Cường Hoa" };

  try {
    const post = await getNewsBySlug(slug);
    if (!post) return { title: "Tin tức | Cường Hoa" };

    const description =
      post.summary ||
      post.excerpt ||
      `Đọc bài viết "${post.title}" tại Cường Hoa — Máy công cụ 2 thì chính hãng.`;

    const keywords = post.tags?.length ? post.tags : undefined;

    const ogImage = post.thumbnail
      ? [{ url: post.thumbnail, width: 1200, height: 630, alt: post.title }]
      : [{ url: `${SITE_URL}/images/banner/banner-ab.jpg`, width: 1200, height: 630, alt: post.title }];

    return {
      metadataBase: new URL(SITE_URL),
      title: `${post.title} | Cường Hoa`,
      description,
      keywords,
      authors: [{ name: post.createdBy || "Cường Hoa" }],
      alternates: { canonical: `/new/${slug}` },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
      openGraph: {
        title: post.title,
        description,
        type: "article",
        url: `/new/${slug}`,
        siteName: "Cường Hoa",
        locale: "vi_VN",
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt || post.createdAt,
        authors: [post.createdBy || "Cường Hoa"],
        section: post.category || "Tin tức",
        tags: keywords,
        images: ogImage,
      },
      twitter: {
        card: "summary_large_image",
        site: "@cuonghoa",
        title: post.title,
        description,
        images: post.thumbnail
          ? [post.thumbnail]
          : [`${SITE_URL}/images/banner/banner-ab.jpg`],
      },
    };
  } catch {
    return { title: "Tin tức | Cường Hoa" };
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!slug) notFound();

  let articleSchema: object | null = null;
  let breadcrumbSchema: object;

  try {
    const post = await getNewsBySlug(slug);

    breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tin tức", item: `${SITE_URL}/new` },
        {
          "@type": "ListItem",
          position: 3,
          name: post?.title ?? "Bài viết",
          item: `${SITE_URL}/new/${slug}`,
        },
      ],
    };

    if (post) {
      const bodyText = stripHtml(post.content);
      const wordCount = countWords(bodyText);

      articleSchema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: post.title,
        description: post.summary || post.excerpt || "",
        image: post.thumbnail
          ? [post.thumbnail]
          : [`${SITE_URL}/images/banner/banner-ab.jpg`],
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
          "@type": "Person",
          name: post.createdBy || "Cường Hoa",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Cường Hoa",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/images/logo.png`,
            width: 200,
            height: 60,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/new/${slug}`,
        },
        keywords: post.tags || undefined,
        articleSection: post.category || "Tin tức",
        inLanguage: "vi",
        ...(wordCount > 0 && { wordCount }),
        url: `${SITE_URL}/new/${slug}`,
        isAccessibleForFree: true,
      };
    }
  } catch {
    breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tin tức", item: `${SITE_URL}/new` },
      ],
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema!) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <PageViewTracker />
      <NewsDetailView slug={slug} />
    </>
  );
}
