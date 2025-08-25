// src/features/admin/shipping/api.ts
import type { ApiResp, ShippingPartner } from "./types";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiListPartners(): Promise<ShippingPartner[]> {
  const res = await fetch(`${BASE}/api/v1/shipping_partners`, {
    headers: { ...authHeaders() },
  });
  const json: ApiResp<ShippingPartner[]> = await res.json();
  if (!res.ok) throw new Error(json.message || "Tải danh sách thất bại");
  // backend của bạn đang trả về { data: [...] } – giữ nguyên
  return (json as any).data ?? [];
}

export async function apiCreatePartner(payload: {
  name: string;
  code: string;
  apiUrl: string | null;
  active: boolean;
}): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/shipping_partners`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Tạo đơn vị thất bại");
}

export async function apiUpdatePartner(
  id: number,
  payload: { name: string; apiUrl: string | null; active: boolean }
): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/shipping_partners/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Cập nhật thất bại");
}
