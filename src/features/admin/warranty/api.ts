import { api, http } from "@/lib/api/http";
import type { PagedWarrantyClaims, WarrantyStatus } from "./types";

// Lấy tối đa 1000 bản ghi – lọc/phân trang ở client
export async function apiListWarrantyClaims() {
  // api.get sẽ unwrap theo ApiEnvelope -> trả về { result, meta }
  return api.get<PagedWarrantyClaims>("/api/v1/warranty_claims/admin", {
    params: { page: 1, size: 1000 },
  });
}

export async function apiUpdateWarrantyClaim(params: {
  claimId: number;
  status: WarrantyStatus | string;
  resolutionNote: string;
}) {
  const { claimId, status, resolutionNote } = params;

  const form = new FormData();
  form.append("status", status);
  form.append("resolutionNote", resolutionNote);

  // Với FormData, đặt content-type multipart để override default application/json
  await http.put(`/api/v1/warranty_claim/${claimId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
