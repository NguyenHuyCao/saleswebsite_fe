import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiListWarrantyClaims, apiUpdateWarrantyClaim } from "./api";
import type { PagedWarrantyClaims, WarrantyStatus } from "./types";

export const QK = {
  claims: ["admin", "warranty", "claims"] as const,
};

export function useWarrantyClaims() {
  return useQuery<PagedWarrantyClaims>({
    queryKey: QK.claims,
    queryFn: apiListWarrantyClaims,
  });
}

export function useUpdateWarrantyClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      claimId: number;
      status: WarrantyStatus | string;
      resolutionNote: string;
    }) => apiUpdateWarrantyClaim(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.claims }),
  });
}
