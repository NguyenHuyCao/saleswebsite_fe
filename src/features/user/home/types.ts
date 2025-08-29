// src/features/user/home/types.ts
export type { Product } from "@/features/user/products/types";

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

export type CategoryWithProducts = Category & {
  products: Product[];
};

export type Promotion = {
  id: number;
  name: string;
  code: string | null;
  discount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  requiresCode: boolean;
};
