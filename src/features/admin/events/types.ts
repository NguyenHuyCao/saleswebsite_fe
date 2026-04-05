export type PromotionStatus = "UPCOMING" | "ACTIVE" | "EXPIRED" | "CLOSED";

export type Promotion = {
  id: number;
  name: string;
  description: string | null;
  code: string | null;
  discount: number; // 0..1
  maxDiscount: number; // VND
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  requiresCode: boolean;
  isActive: boolean;
  status: PromotionStatus;
  applicableProductIds?: number[]; // từ PromotionResponse
};

export type PromotionUpsert = {
  name: string;
  description: string | null;
  code: string | null;
  requiresCode: boolean;
  discount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: number[];
};

export type Product = { id: number; name: string };

export type Category = { id: number; name: string; products: Product[] };

export type Brand = { id: number; name: string; category: Category[] };
