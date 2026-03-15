// src/features/new/queries.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getNewsBySlug, listNews, getRelatedNews } from "./api";
import type { ListNewsResponse, NewsPost } from "./types";

export const newsKeys = {
  all: ["news"] as const,
  lists: () => [...newsKeys.all, "list"] as const,
  list: (filters: {
    q?: string;
    page?: number;
    size?: number;
    category?: string;
  }) => [...newsKeys.lists(), filters] as const,
  details: () => [...newsKeys.all, "detail"] as const,
  detail: (slug: string) => [...newsKeys.details(), slug] as const,
  related: (slug: string, category?: string) =>
    ["news", "related", slug, category] as const,
};

export function useNewsList(q = "", page = 1, size = 12, category = "") {
  return useQuery<ListNewsResponse, Error>({
    queryKey: newsKeys.list({ q, page, size, category }),
    queryFn: () => listNews({ q, page, size, category }),
    placeholderData: (previousData) => previousData,
  });
}

export function useNewsDetail(slug?: string) {
  return useQuery<NewsPost | null, Error>({
    queryKey: newsKeys.detail(slug || ""),
    queryFn: () => getNewsBySlug(slug!),
    enabled: !!slug,
  });
}

export function useRelatedNews(
  slug?: string,
  category?: string,
  limit: number = 3,
) {
  return useQuery<NewsPost[], Error>({
    queryKey: newsKeys.related(slug || "", category),
    queryFn: () => getRelatedNews(slug!, category, limit),
    enabled: !!slug,
  });
}
