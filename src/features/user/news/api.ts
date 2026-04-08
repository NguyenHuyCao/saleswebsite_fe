// src/features/user/news/api.ts
import { api } from "@/lib/api/http";
import type { ListNewsResponse, NewsPost } from "./types";

/** Danh sách bài viết đã xuất bản — có phân trang + lọc theo danh mục */
export async function listNews(params?: {
  page?: number;
  size?: number;
  q?: string;
  category?: string;
}): Promise<ListNewsResponse> {
  const page = params?.page ?? 1;
  const size = params?.size ?? 12;
  const q = params?.q ?? "";
  const category = params?.category ?? "";

  const data = await api.get<ListNewsResponse>("/api/v1/news", {
    params: {
      page,
      size,
      q: q || undefined,
      category: category || undefined,
      sort: "pinned,desc",
    },
  });
  return data ?? { result: [], meta: null };
}

/** Chi tiết bài viết theo slug (tự động tăng lượt xem) */
export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  try {
    return await api.get<NewsPost>(`/api/v1/news/${slug}`);
  } catch {
    return null;
  }
}

/** Bài viết liên quan (cùng danh mục, loại trừ slug hiện tại) */
export async function getRelatedNews(
  slug: string,
  category?: string,
  limit = 3,
): Promise<NewsPost[]> {
  const res = await listNews({ size: limit + 1, category });
  return (res.result ?? []).filter((p) => p.slug !== slug).slice(0, limit);
}
