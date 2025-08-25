export type Promotion = {
  id: number;
  name: string;
  code: string | null;
  discount: number; // 0..1
  maxDiscount: number; // VND
  startDate: string; // ISO
  endDate: string; // ISO
  requiresCode: boolean;
};

export type PromotionUpsert = {
  name: string;
  code: string | null;
  requiresCode: boolean;
  discount: number;
  maxDiscount: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  productIds: number[];
};

export type Product = { id: number; name: string };

export type Category = { id: number; name: string; products: Product[] };

export type Brand = { id: number; name: string; category: Category[] };
