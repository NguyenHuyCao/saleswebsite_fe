import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closePromotionEarly,
  deleteProductFromPromotion,
  deletePromotion,
  fetchBrandsWithProducts,
  fetchPromotionById,
  fetchPromotionProducts,
  fetchPromotions,
  upsertPromotion,
} from "./api";
import type { Promotion, Brand, Product } from "./types";

export const QK = {
  promotions: ["admin", "promotions"] as const,
  promotion: (id: string | number) => ["admin", "promotions", id] as const,
  promoProducts: (id: number) =>
    ["admin", "promotions", id, "products"] as const,
  brandsTree: ["admin", "brands-tree"] as const,
};

export function usePromotions() {
  return useQuery<Promotion[]>({
    queryKey: QK.promotions,
    queryFn: fetchPromotions,
  });
}

export function usePromotion(id?: string | null) {
  return useQuery<Promotion>({
    queryKey: id ? QK.promotion(id) : ["_disabled"],
    queryFn: () => fetchPromotionById(id!),
    enabled: !!id,
  });
}

export function usePromotionProducts(id: number) {
  return useQuery<Product[]>({
    queryKey: QK.promoProducts(id),
    queryFn: () => fetchPromotionProducts(id),
    enabled: id > 0,
  });
}

export function useBrandsTree() {
  return useQuery<Brand[]>({
    queryKey: QK.brandsTree,
    queryFn: fetchBrandsWithProducts,
  });
}

export function useDeleteProductFromPromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      promotionId,
      productId,
    }: {
      promotionId: number;
      productId: number;
    }) => deleteProductFromPromotion(promotionId, productId),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QK.promoProducts(vars.promotionId) });
    },
  });
}

export function useUpsertPromotion(id?: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      upsertPromotion(id ? "PUT" : "POST", payload, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.promotions }),
  });
}

export function useClosePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => closePromotionEarly(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.promotions }),
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePromotion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.promotions }),
  });
}
