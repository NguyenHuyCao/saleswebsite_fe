// features/admin/promotions/api.ts
import { api } from "@/lib/api/http";
import type { Promotion, PromotionUpsert, Product, Brand } from "./types";

/** Lấy toàn bộ danh sách khuyến mãi */
export async function fetchPromotions(): Promise<Promotion[]> {
  return api.get<Promotion[]>("/api/v1/promotions");
}

/** Lấy chi tiết khuyến mãi theo id (BE đang nhận qua query ?promotionId=) */
export async function fetchPromotionById(
  id: string | number
): Promise<Promotion> {
  return api.get<Promotion>("/api/v1/promotions/id", {
    params: { promotionId: id },
  });
}

/** Lấy danh sách sản phẩm áp dụng của 1 khuyến mãi */
export async function fetchPromotionProducts(id: number): Promise<Product[]> {
  return api.get<Product[]>(`/api/v1/promotions/${id}`);
}

/** Xoá 1 sản phẩm khỏi khuyến mãi */
export async function deleteProductFromPromotion(
  promotionId: number,
  productId: number
): Promise<void> {
  await api.delete<void>(`/api/v1/promotions/delete-product/${promotionId}`, {
    params: { productId },
  });
}

/** Tạo / Cập nhật khuyến mãi (JSON body) */
export async function upsertPromotion(
  method: "POST" | "PUT",
  payload: PromotionUpsert,
  id?: string | number
) {
  if (method === "PUT" && id != null) {
    return api.put<Promotion, PromotionUpsert>(
      `/api/v1/promotions/${id}`,
      payload
    );
  }
  return api.post<Promotion, PromotionUpsert>("/api/v1/promotions", payload);
}

/** Cây Brand → Category → Products để chọn SP áp dụng KM
 *  /api/v1/brands thường trả về { result, meta }, nên lấy result ra
 */
export async function fetchBrandsWithProducts(): Promise<Brand[]> {
  const data = await api.get<{ result: Brand[]; meta?: any }>("/api/v1/brands");
  return data.result ?? [];
}
