// src/features/admin/warranty/api.ts
import type {
  ApiEnvelope,
  MetaData,
  WarrantyClaim,
  WarrantyStatus,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Lấy tất cả (tối đa 1000) -> lọc & phân trang ở client
export async function apiListWarrantyClaims(): Promise<{
  result: WarrantyClaim[];
  meta: MetaData | null;
}> {
  const res = await fetch(
    `${BASE}/api/v1/warranty_claims/admin?page=1&size=1000`,
    {
      headers: { ...authHeaders() },
    }
  );
  const json: ApiEnvelope<{ result: WarrantyClaim[]; meta: MetaData }> =
    await res.json();
  if (!res.ok)
    throw new Error((json as any)?.message || "Tải danh sách bảo hành lỗi");
  return { result: json.data?.result ?? [], meta: json.data?.meta ?? null };
}

export async function apiUpdateWarrantyClaim(
  claimId: number,
  status: WarrantyStatus | string,
  resolutionNote: string
): Promise<void> {
  // backend đang nhận FormData nên giữ nguyên
  const form = new FormData();
  form.append("status", status);
  form.append("resolutionNote", resolutionNote);

  const res = await fetch(`${BASE}/api/v1/warranty_claim/${claimId}`, {
    method: "PUT",
    headers: { ...authHeaders() },
    body: form,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(json?.message || "Cập nhật yêu cầu bảo hành thất bại");
}
