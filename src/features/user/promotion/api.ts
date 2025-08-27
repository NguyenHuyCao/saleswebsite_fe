// promotion/api.ts
"use client";
import { api } from "@/lib/api/http";
import type { Promotion, PromotionRaw } from "./types";

export async function getPromotions(): Promise<{
  all: Promotion[];
  flashPromotions: Promotion[];
}> {
  const list = await api.get<PromotionRaw[]>("/api/v1/promotions");
  const all: Promotion[] =
    (list || []).map((p) => ({
      id: Number(p.id),
      name: p.name,
      code: p.code ?? null,
      discount: Number(p.discount ?? 0),
      maxDiscount: Number(p.maxDiscount ?? 0),
      startDate: p.startDate,
      endDate: p.endDate,
      requiresCode: !!p.requiresCode,
    })) ?? [];
  const flashPromotions = all.filter((p) => !p.requiresCode);
  return { all, flashPromotions };
}
