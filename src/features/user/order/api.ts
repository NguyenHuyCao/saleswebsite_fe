import { api, http } from "@/lib/api/http";
import type { Order } from "./types";

export async function fetchMyOrders(): Promise<Order[]> {
  const data = await api.get<Order[] | { result: Order[] }>(
    "/api/v1/orders/me",
  );
  return Array.isArray(data) ? data : data?.result ?? [];
}

/** Huỷ đơn hàng – cho PENDING / WAITING_PAYMENT / CONFIRMED */
export async function cancelOrder(params: {
  orderId: number | string;
  reason?: string;
}): Promise<void> {
  await http.post(`/api/v1/orders/${params.orderId}/cancel`, {
    reason: params.reason ?? null,
  });
}
