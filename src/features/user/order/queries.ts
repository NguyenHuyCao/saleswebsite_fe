"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyOrders, cancelOrder } from "./api";
import type { Order } from "./types";

export const ordersKeys = {
  all: ["orders"] as const,
  me: ["orders", "me"] as const,
};

export function useMyOrdersQuery() {
  return useQuery<Order[], Error>({
    queryKey: ordersKeys.me,
    queryFn: fetchMyOrders,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useCancelOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { orderId: number | string; reason?: string }) =>
      cancelOrder(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKeys.me }),
  });
}
