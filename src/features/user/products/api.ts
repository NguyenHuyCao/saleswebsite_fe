// src/features/user/product/api.ts
"use server";

import { api } from "@/lib/api/http";
import type { Brand, CategoryWithProducts, Product } from "./types";

/* ------------ Mappers (đồng bộ với list page) ------------ */
function mapProduct(item: any, nowMs: number): Product {
  const createdAtMs = new Date(item.createdAt).getTime();
  const isNew = (nowMs - createdAtMs) / (1000 * 60 * 60 * 24) <= 30;

  const currentPrice = item.pricePerUnit ?? item.price ?? 0;
  const originalPrice = item.price ?? currentPrice;

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    imageAvt: item.imageAvt,
    imageDetail1: item.imageDetail1 || "",
    imageDetail2: item.imageDetail2 || "",
    imageDetail3: item.imageDetail3 || "",
    description: item.description || "",
    price: currentPrice,
    pricePerUnit: currentPrice,
    originalPrice,
    sale: currentPrice < originalPrice,
    inStock: item.active === true && (item.stockQuantity ?? 0) > 0,
    label: item.active ? "Thêm vào giỏ" : "Hết hàng",
    stockQuantity: item.stockQuantity ?? 0,
    totalStock: item.totalStock ?? 0,
    power: item.power || "",
    fuelType: item.fuelType || "",
    engineType: item.engineType || "",
    weight: item.weight || 0,
    dimensions: item.dimensions || "",
    tankCapacity: item.tankCapacity ?? 0,
    origin: item.origin || "",
    warrantyMonths: item.warrantyMonths ?? 0,
    createdAt: item.createdAt,
    createdBy: item.createdBy || "",
    updatedAt: item.updatedAt || null,
    updatedBy: item.updatedBy || "",
    rating: item.rating ?? 0,
    status:
      (item.stockQuantity ?? 0) === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
    favorite: item.wishListUser === true,
  };
}

/* -------------------- Public APIs -------------------- */

/** Server: lấy categories kèm products (chuẩn hoá giá & trạng thái) – dùng http/api custom */
export async function getCategoriesWithProducts(): Promise<
  CategoryWithProducts[]
> {
  try {
    // Backend có thể trả { data: { result: [...] } } hoặc { data: [...] }
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
    // Fail-soft để không làm vỡ trang
    return [];
  }
}

/** Server: lấy brands – dùng http/api custom */
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
