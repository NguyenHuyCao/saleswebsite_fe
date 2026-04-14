import { api, http } from "@/lib/api/http";
import type { PagedWarrantyClaims, WarrantyStatus } from "./types";

// Lấy tất cả yêu cầu bảo hành (admin)
export async function apiListWarrantyClaims() {
  return api.get<PagedWarrantyClaims>("/api/v1/warranty-claims", {
    params: { page: 1, size: 1000 },
  });
}

// Cập nhật trạng thái yêu cầu bảo hành — backend nhận @RequestParam (không phải body/FormData)
export async function apiUpdateWarrantyClaim(params: {
  claimId: number;
  status: WarrantyStatus | string;
  resolutionNote: string;
  adminMessage?: string;
}) {
  const { claimId, status, resolutionNote, adminMessage } = params;
  await http.put(`/api/v1/warranty-claims/${claimId}`, null, {
    params: { status, resolutionNote, adminMessage },
  });
}
