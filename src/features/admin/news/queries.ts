import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews, deleteNews, fetchAdminNews, updateNews } from "./api";
import type { NewsListResponse } from "./types";

export const QK = {
  news: (page: number, size: number) => ["admin-news", page, size] as const,
};

export function useAdminNews(page = 1, size = 1000) {
  return useQuery<NewsListResponse>({
    queryKey: QK.news(page, size),
    queryFn: () => fetchAdminNews({ page, size }),
  });
}

export function useCreateNews(page = 1, size = 1000) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fd: FormData) => createNews(fd),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-news"] }),
  });
}

export function useUpdateNews(page = 1, size = 1000) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fd }: { id: number; fd: FormData }) => updateNews(id, fd),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-news"] }),
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteNews(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-news"] }),
  });
}
