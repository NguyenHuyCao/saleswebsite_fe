import { api } from "@/lib/api/http";
import type { ListNewsResponse, NewsPost } from "./types";

/** NOTE: đổi PATH nếu BE dùng /posts thay vì /news */
const PATH = "/api/v1/news";

/** Danh sách tin có phân trang + keyword (server-side) */
export async function listNews(params?: {
  page?: number;
  size?: number;
  q?: string;
}): Promise<ListNewsResponse> {
  const page = params?.page ?? 1;
  const size = params?.size ?? 12;
  const q = params?.q ?? "";
  // api.get đã unwrap -> trả { result, meta } nếu BE theo envelope
  return api.get<ListNewsResponse>(`${PATH}`, { params: { page, size, q } });
}

/** Chi tiết theo slug */
export async function getNewsBySlug(slug: string): Promise<NewsPost> {
  return api.get<NewsPost>(`${PATH}/${slug}`);
}
