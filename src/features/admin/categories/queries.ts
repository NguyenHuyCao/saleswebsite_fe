import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "./api";
import type { CategoryListResponse } from "./types";

export const QK = {
  categories: (page: number, size: number) =>
    ["admin", "categories", page, size] as const,
};

export function useCategories(page = 1, size = 1000) {
  return useQuery<CategoryListResponse>({
    queryKey: QK.categories(page, size),
    queryFn: () => fetchCategories(page, size),
  });
}

export function useCreateCategory(page = 1, size = 1000) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fd: FormData) => createCategory(fd),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QK.categories(page, size) }),
  });
}

export function useUpdateCategory(page = 1, size = 1000) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fd }: { id: number; fd: FormData }) =>
      updateCategory(id, fd),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QK.categories(page, size) }),
  });
}

export function useDeleteCategory(page = 1, size = 1000) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QK.categories(page, size) }),
  });
}
