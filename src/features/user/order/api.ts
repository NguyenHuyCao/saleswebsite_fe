import { api } from "@/lib/api/http";
import type { Order } from "./types";

/**
 * /api/v1/history_orders hiện backend trả { data: Order[] } (ApiEnvelope)
 * nên dùng api.get sẽ tự unwrap -> Order[].
 * Nếu BE đổi sang {result, meta}, vẫn đảm bảo bằng nhánh fallback.
 */
export async function fetchMyOrders(): Promise<Order[]> {
  const data = await api.get<Order[] | { result: Order[] }>(
    "/api/v1/orders/me",
  );
  return Array.isArray(data) ? data : data?.result ?? [];
}
