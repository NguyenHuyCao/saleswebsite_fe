// promotion/api.ts
"use server";

import { cookies } from "next/headers";
import type { Promotion } from "./types";

export async function getPromotions(): Promise<{
  all: Promotion[];
  flashPromotions: Promotion[];
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/promotions`, {
    headers,
    cache: "no-store",
  });
  const data = await res.json();
  const all: Promotion[] = (data?.data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    code: p.code ?? null,
    discount: Number(p.discount) ?? 0,
    maxDiscount: Number(p.maxDiscount) ?? 0,
    startDate: p.startDate,
    endDate: p.endDate,
    requiresCode: !!p.requiresCode,
  }));

  const flashPromotions = all.filter((p) => !p.requiresCode);
  return { all, flashPromotions };
}
