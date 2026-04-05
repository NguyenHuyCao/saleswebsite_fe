// features/admin/events/api.ts
import { api, http } from "@/lib/api/http";
import type { Promotion, PromotionUpsert, Product, Brand } from "./types";

/** Lấy toàn bộ danh sách khuyến mãi (admin) */
export async function fetchPromotions(): Promise<Promotion[]> {
  return api.get<Promotion[]>("/api/v1/promotions");
}

/** Lấy chi tiết khuyến mãi theo id */
export async function fetchPromotionById(
  id: string | number
): Promise<Promotion> {
  return api.get<Promotion>(`/api/v1/promotions/${id}`);
}

/** Lấy danh sách sản phẩm áp dụng của 1 khuyến mãi */
export async function fetchPromotionProducts(id: number): Promise<Product[]> {
  return api.get<Product[]>(`/api/v1/promotions/${id}/products`);
}

/** Xoá 1 sản phẩm khỏi khuyến mãi */
export async function deleteProductFromPromotion(
  promotionId: number,
  productId: number
): Promise<void> {
  await http.delete(`/api/v1/promotions/${promotionId}/products/${productId}`);
}

/** Tạo / Cập nhật khuyến mãi (JSON body) */
export async function upsertPromotion(
  method: "POST" | "PUT",
  payload: PromotionUpsert,
  id?: string | number
): Promise<void> {
  if (method === "PUT" && id != null) {
    await http.put(`/api/v1/promotions/${id}`, payload);
  } else {
    await http.post("/api/v1/promotions", payload);
  }
}

/** Đóng sớm khuyến mãi (endDate = hôm qua) */
export async function closePromotionEarly(id: number): Promise<void> {
  await http.patch(`/api/v1/promotions/${id}/close`);
}

/** Xoá hoàn toàn khuyến mãi */
export async function deletePromotion(id: number): Promise<void> {
  await http.delete(`/api/v1/promotions/${id}`);
}

/** Cây Brand → Category → Products để chọn SP áp dụng KM */
export async function fetchBrandsWithProducts(): Promise<Brand[]> {
  const data = await api.get<{ result: Brand[]; meta?: any }>("/api/v1/brands");
  return data.result ?? [];
}
