// ─── Shared ───────────────────────────────────────────────────────────────────

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  type: "STORE" | "ONLINE";
  isDefaultOnline: boolean;
  isActive: boolean;
}

// ─── Import order ─────────────────────────────────────────────────────────────

export type ImportStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface StockImportItem {
  id: number;
  productId: number;
  productName: string;
  variantId: number | null;
  variantDesc: string | null;
  quantity: number;
  costPrice: number;
  totalCost: number;
}

export interface StockImport {
  id: number;
  importCode: string;
  warehouseId: number;
  warehouseName: string;
  status: ImportStatus;
  totalCost: number;
  note: string | null;
  confirmedAt: string | null;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  items: StockImportItem[];
}

export interface StockImportItemRequest {
  productId: number;
  variantId: number | null;
  quantity: number;
  costPrice: number;
}

export interface StockImportRequest {
  warehouseId: number;
  items: StockImportItemRequest[];
  note?: string;
}

// ─── Inventory / Overview ─────────────────────────────────────────────────────

export interface InventoryRow {
  id: number;
  warehouseId: number;
  warehouseName: string;
  productId: number;
  productName: string;
  variantId: number | null;
  variantDesc: string | null;
  quantity: number;
  minQuantity: number;
  costPrice: number;
  inventoryValue: number; // quantity * costPrice
}

export interface WarehouseStats {
  totalSkus: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

// ─── Store orders (POS) ───────────────────────────────────────────────────────

export type StorePaymentMethod = "CASH" | "TRANSFER" | "CARD";

export interface StoreOrderItem {
  id: number;
  productId: number;
  variantId: number | null;
  productNameSnap: string;
  variantSnap: string | null;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discountAmount: number;
  totalPrice: number;
}

export interface StoreOrder {
  id: number;
  orderCode: string;
  warehouseId: number;
  warehouseName: string;
  customerName: string | null;
  customerPhone: string | null;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: StorePaymentMethod;
  amountPaid: number;
  amountChange: number;
  note: string | null;
  createdBy: string | null;
  createdAt: string | null;
  items: StoreOrderItem[];
}

export interface StoreOrderItemRequest {
  productId: number;
  variantId: number | null;
  productNameSnap: string;
  variantSnap: string | null;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discountAmount: number;
}

export interface StoreOrderRequest {
  warehouseId: number;
  customerName?: string;
  customerPhone?: string;
  discountAmount: number;
  paymentMethod: StorePaymentMethod;
  amountPaid: number;
  note?: string;
  items: StoreOrderItemRequest[];
}

// ─── Stock transactions ───────────────────────────────────────────────────────

export type TxnType =
  | "IMPORT"
  | "EXPORT_ONLINE"
  | "EXPORT_STORE"
  | "TRANSFER_OUT"
  | "TRANSFER_IN"
  | "ADJUSTMENT"
  | "RETURN";

export interface StockTransaction {
  id: number;
  transactionCode: string;
  type: TxnType;
  warehouseId: number;
  warehouseName: string;
  productId: number;
  productName: string;
  variantId: number | null;
  variantDesc: string | null;
  quantityBefore: number;
  quantityChange: number;
  quantityAfter: number;
  costPrice: number;
  salePrice: number;
  referenceId: number | null;
  referenceType: string | null;
  note: string | null;
  createdBy: string | null;
  createdAt: string;
}
