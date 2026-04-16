import { api, http } from "@/lib/api/http";
import type {
  StockImport,
  StockImportRequest,
  Warehouse,
  WarehouseStats,
  InventoryRow,
  StoreOrder,
  StoreOrderRequest,
  StockTransaction,
} from "./types";

// ─── Warehouses ───────────────────────────────────────────────────────────────

export async function apiListWarehouses(): Promise<Warehouse[]> {
  return api.get<Warehouse[]>("/api/v1/admin/warehouse/list");
}

// ─── Overview / Inventory ─────────────────────────────────────────────────────

export async function apiWarehouseStats(): Promise<WarehouseStats> {
  return api.get<WarehouseStats>("/api/v1/admin/warehouse/overview/stats");
}

export async function apiListInventory(params?: {
  warehouseId?: number;
  lowStock?: boolean;
  search?: string;
  page?: number;
  size?: number;
}): Promise<{ result: InventoryRow[]; meta: any }> {
  return api.get("/api/v1/admin/warehouse/inventory", { params });
}

// ─── Import orders ────────────────────────────────────────────────────────────

export async function apiCreateImport(body: StockImportRequest): Promise<StockImport> {
  return api.post<StockImport>("/api/v1/admin/warehouse/imports", body);
}

export async function apiListImports(params?: {
  warehouseId?: number;
  status?: string;
  page?: number;
  size?: number;
}): Promise<{ result: StockImport[]; meta: any }> {
  return api.get("/api/v1/admin/warehouse/imports", { params });
}

export async function apiGetImport(id: number): Promise<StockImport> {
  return api.get<StockImport>(`/api/v1/admin/warehouse/imports/${id}`);
}

export async function apiConfirmImport(id: number): Promise<StockImport> {
  return api.put<StockImport>(`/api/v1/admin/warehouse/imports/${id}/confirm`);
}

export async function apiCancelImport(id: number): Promise<void> {
  await http.put(`/api/v1/admin/warehouse/imports/${id}/cancel`);
}

// ─── Store orders (POS) ───────────────────────────────────────────────────────

export async function apiCreateStoreOrder(body: StoreOrderRequest): Promise<StoreOrder> {
  return api.post<StoreOrder>("/api/v1/admin/warehouse/store-orders", body);
}

export async function apiListStoreOrders(params?: {
  warehouseId?: number;
  page?: number;
  size?: number;
}): Promise<{ result: StoreOrder[]; meta: any }> {
  return api.get("/api/v1/admin/warehouse/store-orders", { params });
}

export async function apiGetStoreOrder(id: number): Promise<StoreOrder> {
  return api.get<StoreOrder>(`/api/v1/admin/warehouse/store-orders/${id}`);
}

// ─── Stock transactions ───────────────────────────────────────────────────────

export async function apiListTransactions(params?: {
  warehouseId?: number;
  type?: string;
  productId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}): Promise<{ result: StockTransaction[]; meta: any }> {
  return api.get("/api/v1/admin/warehouse/transactions", { params });
}
