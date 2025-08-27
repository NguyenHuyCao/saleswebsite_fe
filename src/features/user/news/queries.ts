"use client";

import { useQuery } from "@tanstack/react-query";
import { getNewsBySlug, listNews } from "./api";
import type { ListNewsResponse, NewsPost } from "./types";

export const newsKeys = {
  list: (q: string, page: number, size: number) =>
    ["news", { q, page, size }] as const,
  detail: (slug: string) => ["news", "detail", slug] as const,
};

export function useNewsList(q = "", page = 1, size = 12) {
  return useQuery<ListNewsResponse, Error>({
    queryKey: newsKeys.list(q, page, size),
    queryFn: () => listNews({ q, page, size }),
  });
}

export function useNewsDetail(slug?: string) {
  return useQuery<NewsPost, Error>({
    queryKey: newsKeys.detail(slug || ""),
    queryFn: () => getNewsBySlug(slug!),
    enabled: !!slug,
  });
}
