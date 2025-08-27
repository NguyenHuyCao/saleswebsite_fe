"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "./api";
import type { Order } from "./types";

export const ordersKeys = {
  all: ["orders"] as const,
  me: ["orders", "me"] as const,
};

export function useMyOrdersQuery() {
  return useQuery<Order[], Error>({
    queryKey: ordersKeys.me,
    queryFn: fetchMyOrders,
  });
}
