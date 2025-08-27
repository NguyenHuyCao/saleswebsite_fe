import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPartner, listPartners, updatePartner } from "./api";
import type {
  ShippingPartner,
  CreateShippingPartner,
  UpdateShippingPartner,
} from "./types";

export const SHIP_QK = {
  partners: ["admin", "shipping", "partners"] as const,
};

export function useShippingPartners() {
  return useQuery<ShippingPartner[]>({
    queryKey: SHIP_QK.partners,
    queryFn: listPartners,
  });
}

export function useCreateShippingPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShippingPartner) => createPartner(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SHIP_QK.partners }),
  });
}

export function useUpdateShippingPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number; payload: UpdateShippingPartner }) =>
      updatePartner(v.id, v.payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SHIP_QK.partners }),
  });
}
