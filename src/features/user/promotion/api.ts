// promotion/api.ts — user-facing
"use client";
import { api } from "@/lib/api/http";
import type { Promotion, PromotionRaw } from "./types";

/**
 * Lấy danh sách khuyến mãi PUBLIC đang active để hiển thị Flash Sale cho user.
 * Chỉ trả về PUBLIC (requiresCode=false) và còn trong thời hạn.
 */
export async function getPromotions(): Promise<{
  all: Promotion[];
  flashPromotions: Promotion[];
}> {
  const list = await api.get<PromotionRaw[]>("/api/v1/promotions/public/active");
  const all: Promotion[] = (list || []).map((p) => ({
    id: Number(p.id),
    name: p.name,
    code: p.code ?? null,
    discount: Number(p.discount ?? 0),
    maxDiscount: Number(p.maxDiscount ?? 0),
    startDate: p.startDate,
    endDate: p.endDate,
    requiresCode: !!p.requiresCode,
  }));
  // flashPromotions = tất cả PUBLIC đang active (đã lọc sẵn ở BE)
  return { all, flashPromotions: all };
}
