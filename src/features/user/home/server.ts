"use client";
import { PromotionRaw } from './../promotion/types';

import { api } from "@/lib/api/http";
import type { Promotion } from "./types";

/** Client fetch: interceptor tự gắn Bearer từ localStorage */
export async function getFlashPromotions(): Promise<Promotion[]> {
  const list = await api.get<PromotionRaw[]>(
    "/api/v1/promotions/type?requiresCode=false&activeOnly=true"
  );
  const mapped: Promotion[] =
    (list || []).map((p) => ({
      id: Number(p.id),
      name: String(p.name ?? ""),
      code: p.code ?? null,
      discount: Number(p.discount ?? 0),
      maxDiscount: Number(p.maxDiscount ?? 0),
      startDate: p.startDate ?? "",
      endDate: p.endDate ?? "",
      requiresCode: !!p.requiresCode,
    })) ?? [];
  return mapped.filter((x) => !x.requiresCode);
}
