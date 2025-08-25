// src/features/admin/products/types.ts
export type Id = number;

export interface Product {
  id: Id;
  name: string;
  slug: string;
  description: string;
  origin: string;
  categoryId: Id | null;
  brandId: Id | null;
  categoryName?: string;
  brandName?: string;
  power: string;
  fuelType: string;
  engineType: string;
  weight: number | null;
  dimensions: string;
  tankCapacity: number | null;
  price: number | null;
  costPrice?: number | null;
  stockQuantity: number | null;
  warrantyMonths: number | null;
  imageAvt?: string | File | null;
  imageDetail1?: string | File | null;
  imageDetail2?: string | File | null;
  imageDetail3?: string | File | null;
  active?: boolean;
}

export interface Paged<T> {
  result: T[];
  meta: { total: number };
}

export interface ApiResp<T> {
  message: string;
  data: T;
}

export interface SimpleOption {
  id: Id;
  name: string;
}
