export interface WishlistRaw {
  id: number;
  name: string;
  slug: string;
  imageAvt: string;
  imageDetail1?: string | null;
  imageDetail2?: string | null;
  imageDetail3?: string | null;
  description?: string | null;
  price: number; // giá niêm yết
  pricePerUnit: number; // giá bán
  stockQuantity: number;
  totalStock: number;
  power?: string | null;
  fuelType?: string | null;
  engineType?: string | null;
  weight?: number | null;
  dimensions?: string | null;
  tankCapacity?: number | null;
  origin?: string | null;
  warrantyMonths?: number | null;
  createdAt: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
  rating?: number | null;
  wishListUser?: boolean;
}

export type WishlistResponse = {
  result: WishlistRaw[];
  meta?: { page: number; pageSize: number; pages: number; total: number };
};
