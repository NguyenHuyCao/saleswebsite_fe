// src/features/user/category/api.ts
import { api } from "@/lib/api/http";
import type { Category, Paged } from "./types";

export async function getCategories(): Promise<Category[]> {
  const payload = await api.get<Paged<Category>>("/api/v1/categories");
  return payload.result ?? [];
}
