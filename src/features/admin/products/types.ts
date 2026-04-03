// src/features/admin/products/types.ts
export type Id = number;
export type ProductType = "MACHINE" | "CLOTHING" | "ACCESSORY" | "OTHER";

export interface ProductVariant {
  id: number;
  size: string | null;
  color: string | null;
  sku: string | null;
  stockQuantity: number;
  priceOverride: number | null;
  active: boolean;
}

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

  // Machine-specific (nullable for non-machine)
  power?: string | null;
  fuelType?: string | null;
  engineType?: string | null;
  weight?: number | null;
  dimensions?: string | null;
  tankCapacity?: number | null;

  // Pricing & inventory
  price: number | null;
  costPrice?: number | null;
  stockQuantity: number | null;
  totalStock?: number | null;
  warrantyMonths?: number | null;

  // Images
  imageAvt?: string | File | null;
  imageDetail1?: string | File | null;
  imageDetail2?: string | File | null;
  imageDetail3?: string | File | null;

  // Status
  active?: boolean;
  rating?: number;
  createdAt?: string | null;
  updatedAt?: string | null;

  // Product type & clothing fields
  productType?: ProductType;
  size?: string | null;
  color?: string | null;
  material?: string | null;

  // Variants (non-machine products)
  variants?: ProductVariant[];
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
