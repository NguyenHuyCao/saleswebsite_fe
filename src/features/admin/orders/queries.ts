import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiConfirmCodPaid,
  apiGetOrder,
  apiListOrders,
  apiRefundOrder,
  apiUpdateOrderStatus,
} from "./api";
import type { OrderDetail, OrderListItem, PagedResp } from "./types";

export const QK = {
  orders: ["admin", "orders"] as const,
  order: (id: number | string) => ["admin", "orders", String(id)] as const,
};

// ===== Queries =====
export function useOrders() {
  return useQuery<PagedResp<OrderListItem>>({
    queryKey: QK.orders,
    queryFn: apiListOrders,
  });
}

export function useOrder(orderId?: number | string | null) {
  return useQuery<OrderDetail>({
    queryKey: orderId ? QK.order(orderId) : ["_disabled", "order"],
    queryFn: () => apiGetOrder(orderId!),
    enabled: !!orderId,
  });
}

// ===== Mutations =====
export function useUpdateOrderStatus(orderId: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: string) =>
      apiUpdateOrderStatus({
        orderId,
        status,
        shippingStatusFromPartner: null,
      }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: QK.order(orderId) }),
        qc.invalidateQueries({ queryKey: QK.orders }),
      ]);
    },
  });
}

export function useConfirmCodPaid(orderId: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiConfirmCodPaid(orderId),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: QK.order(orderId) }),
        qc.invalidateQueries({ queryKey: QK.orders }),
      ]);
    },
  });
}

export function useRefundOrder(orderId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { orderDetailId: number; refundAmount: number }) =>
      apiRefundOrder({ orderId, ...params }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.order(orderId) });
    },
  });
}
