"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./api";
import type { Category } from "./types";

export const categoriesKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: categoriesKeys.all,
    queryFn: getCategories,
    staleTime: 60_000,
  });
}
