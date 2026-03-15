// wishlist/types.ts
import type { Product } from "@/features/user/products/types";

export interface WishlistRaw {
  id: number;
  productId: number;
  userId: number;
  createdAt: string;
  product: Product;
}

export interface WishlistResponse {
  result: WishlistRaw[];
  meta?: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

export interface WishlistStats {
  totalItems: number;
  totalValue: number;
  discountItems: number;
}
