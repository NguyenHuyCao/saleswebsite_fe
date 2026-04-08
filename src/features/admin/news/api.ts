import { api } from "@/lib/api/http";
import type { NewsArticle, NewsListResponse } from "./types";

export async function fetchAdminNews(params?: {
  page?: number;
  size?: number;
}) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 1000;
  return api.get<NewsListResponse>("/api/v1/admin/news", {
    params: { page, size, sort: "createdAt,desc" },
  });
}

export async function createNews(fd: FormData) {
  return api.post<NewsArticle, FormData>("/api/v1/admin/news", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateNews(id: number, fd: FormData) {
  return api.put<NewsArticle, FormData>(`/api/v1/admin/news/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteNews(id: number) {
  return api.delete<void>(`/api/v1/admin/news/${id}`);
}
