import { api, http } from "@/lib/api/http";
import type { OrderDetail, OrderListItem, PagedResp } from "./types";

// ===== List + Detail =====
export async function apiListOrders() {
  // api.get sẽ unwrap về data => { result, meta }
  return api.get<PagedResp<OrderListItem>>("/api/v1/orders", {
    params: { page: 1, size: 1000 },
  });
}

export async function apiGetOrder(orderId: number | string) {
  return api.get<OrderDetail>(`/api/v1/orders/${orderId}`);
}

// ===== Mutations =====
export async function apiUpdateOrderStatus(params: {
  orderId: number | string;
  status: string;
  shippingStatusFromPartner?: string | null;
}) {
  const { orderId, status, shippingStatusFromPartner = null } = params;
  await http.put(`/api/v1/orders/${orderId}/status`, {
    status,
    shippingStatusFromPartner,
  });
}

export async function apiConfirmCodPaid(orderId: number | string) {
  await http.put(`/api/v1/payments/${orderId}/cod-paid`);
}

export async function apiRefundOrder(payload: {
  orderId: number;
  orderDetailId: number;
  refundAmount: number;
}) {
  await http.post(`/api/v1/refund_order`, payload);
}
