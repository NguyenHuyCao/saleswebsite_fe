// src/features/new/api.ts
import { newsPosts } from "./data";
import type { ListNewsResponse, NewsPost } from "./types";

/** Mô phỏng API delay */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Danh sách tin có phân trang + keyword (server-side) */
export async function listNews(params?: {
  page?: number;
  size?: number;
  q?: string;
  category?: string;
}): Promise<ListNewsResponse> {
  await delay(500); // Mô phỏng loading

  const page = params?.page ?? 1;
  const size = params?.size ?? 12;
  const q = params?.q?.toLowerCase() ?? "";
  const category = params?.category ?? "";

  // Filter theo keyword và category
  let filtered = [...newsPosts];

  if (q) {
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.content?.toLowerCase().includes(q),
    );
  }

  if (category) {
    filtered = filtered.filter(
      (post) => post.category?.toLowerCase() === category.toLowerCase(),
    );
  }

  // Phân trang
  const start = (page - 1) * size;
  const paginated = filtered.slice(start, start + size);

  return {
    result: paginated,
    meta: {
      page,
      pageSize: size,
      pages: Math.ceil(filtered.length / size),
      total: filtered.length,
    },
  };
}

/** Chi tiết theo slug */
export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  await delay(300);
  const post = newsPosts.find((p) => p.slug === slug);
  return post || null;
}

/** Lấy bài viết liên quan */
export async function getRelatedNews(
  slug: string,
  category?: string,
  limit: number = 3,
): Promise<NewsPost[]> {
  await delay(300);
  let related = newsPosts.filter((p) => p.slug !== slug);

  if (category) {
    related = related.filter((p) => p.category === category);
  }

  return related.slice(0, limit);
}
