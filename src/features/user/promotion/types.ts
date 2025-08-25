// promotion/types.ts
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

// Dùng lại Product/Category chung của app để đồng bộ với ProductCard
// export type { Product, Category } from "@/product/types";
