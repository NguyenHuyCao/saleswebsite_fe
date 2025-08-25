import { http } from "@/lib/api/http";
import type { BrandListApiResponse, Brand, Meta } from "./types";

export async function fetchBrands(): Promise<{ items: Brand[]; meta: Meta }> {
  const res = await http.get<BrandListApiResponse>("/api/v1/brands");
  const payload = res.data;
  const items = payload?.data?.result ?? [];
  const meta = payload?.data?.meta ?? {
    page: 1,
    pageSize: 0,
    pages: 0,
    total: 0,
  };
  return { items, meta };
}
