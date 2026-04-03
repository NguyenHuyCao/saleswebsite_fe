// src/features/user/product/api.ts
"use server";

import { api } from "@/lib/api/http";
import { mapProduct } from "@/lib/utils/productMapper";
import type { Brand, CategoryWithProducts } from "./types";

/** Server: lấy categories kèm products (chuẩn hoá giá & trạng thái) */
export async function getCategoriesWithProducts(): Promise<
  CategoryWithProducts[]
> {
  try {
    const payload = await api.get<{ result: any[] } | any[]>(
      "/api/v1/categories"
    );
    const rawList: any[] = Array.isArray(payload)
      ? payload
      : (payload as any)?.result ?? [];

    const nowMs = Date.now();

    return rawList.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image || category.imageAvt,
      products: (category.products || [])
        .slice(0, 4)
        .map((p: any) => mapProduct(p, nowMs)),
    }));
  } catch {
    return [];
  }
}

/** Server: lấy brands */
export async function getBrands(): Promise<Brand[]> {
  try {
    const payload = await api.get<{ result: Brand[] } | Brand[]>(
      "/api/v1/brands"
    );
    const list: Brand[] = Array.isArray(payload)
      ? (payload as Brand[])
      : ((payload as any)?.result as Brand[]) ?? [];
    return list;
  } catch {
    return [];
  }
}
