import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiListWarehouses,
  apiWarehouseStats,
  apiListInventory,
  apiCreateImport,
  apiListImports,
  apiGetImport,
  apiConfirmImport,
  apiCancelImport,
  apiCreateStoreOrder,
  apiListStoreOrders,
  apiGetStoreOrder,
  apiListTransactions,
} from "./api";
import type { StockImportRequest, StoreOrderRequest } from "./types";

export const QK = {
  warehouses:    ["admin", "warehouse", "list"]         as const,
  stats:         ["admin", "warehouse", "stats"]        as const,
  inventory:     (p?: object) => ["admin", "warehouse", "inventory", p]  as const,
  imports:       (p?: object) => ["admin", "warehouse", "imports", p]    as const,
  importDetail:  (id: number) => ["admin", "warehouse", "imports", id]   as const,
  storeOrders:   (p?: object) => ["admin", "warehouse", "store-orders", p] as const,
  storeOrder:    (id: number) => ["admin", "warehouse", "store-orders", id] as const,
  transactions:  (p?: object) => ["admin", "warehouse", "transactions", p]  as const,
};

// ─── Warehouses ───────────────────────────────────────────────────────────────

export function useWarehouses() {
  return useQuery({ queryKey: QK.warehouses, queryFn: apiListWarehouses });
}

// ─── Overview ─────────────────────────────────────────────────────────────────

export function useWarehouseStats() {
  return useQuery({ queryKey: QK.stats, queryFn: apiWarehouseStats });
}

export function useInventory(params?: Parameters<typeof apiListInventory>[0]) {
  return useQuery({
    queryKey: QK.inventory(params),
    queryFn: () => apiListInventory(params),
  });
}

// ─── Import orders ────────────────────────────────────────────────────────────

export function useImports(params?: Parameters<typeof apiListImports>[0]) {
  return useQuery({
    queryKey: QK.imports(params),
    queryFn: () => apiListImports(params),
  });
}

export function useImportDetail(id: number) {
  return useQuery({
    queryKey: QK.importDetail(id),
    queryFn: () => apiGetImport(id),
    enabled: id > 0,
  });
}

export function useCreateImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: StockImportRequest) => apiCreateImport(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "warehouse", "imports"] }),
  });
}

export function useConfirmImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiConfirmImport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "warehouse", "imports"] });
      qc.invalidateQueries({ queryKey: ["admin", "warehouse", "inventory"] });
      qc.invalidateQueries({ queryKey: ["admin", "warehouse", "stats"] });
    },
  });
}

export function useCancelImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiCancelImport(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "warehouse", "imports"] }),
  });
}

// ─── Store orders ─────────────────────────────────────────────────────────────

export function useStoreOrders(params?: Parameters<typeof apiListStoreOrders>[0]) {
  return useQuery({
    queryKey: QK.storeOrders(params),
    queryFn: () => apiListStoreOrders(params),
  });
}

export function useStoreOrderDetail(id: number) {
  return useQuery({
    queryKey: QK.storeOrder(id),
    queryFn: () => apiGetStoreOrder(id),
    enabled: id > 0,
  });
}

export function useCreateStoreOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: StoreOrderRequest) => apiCreateStoreOrder(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "warehouse", "store-orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "warehouse", "inventory"] });
      qc.invalidateQueries({ queryKey: ["admin", "warehouse", "stats"] });
    },
  });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export function useTransactions(params?: Parameters<typeof apiListTransactions>[0]) {
  return useQuery({
    queryKey: QK.transactions(params),
    queryFn: () => apiListTransactions(params),
  });
}
