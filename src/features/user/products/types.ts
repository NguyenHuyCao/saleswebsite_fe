// src/features/user/products/types.ts
export type Product = {
  id: number;
  name: string;
  slug: string;
  imageAvt: string;
  imageDetail1?: string;
  imageDetail2?: string;
  imageDetail3?: string;
  description?: string;

  price: number;
  pricePerUnit: number;
  originalPrice: number;
  sale: boolean;

  inStock: boolean;
  label: string;
  stockQuantity: number;
  totalStock: number;

  power?: string;
  fuelType?: string;
  engineType?: string;
  weight?: number;
  dimensions?: string;
  tankCapacity?: number;
  origin?: string;
  warrantyMonths?: number;

  createdAt: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  rating?: number;
  status: string[]; // BẮT BUỘC, dùng cho tag “Mới”, “Hết hàng”
  favorite?: boolean;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  products?: Product[]; // optional nếu trang không cần
};

export type CategoryWithProducts = Category & { products: Product[] };

export type Brand = {
  id: number;
  name: string;
  logo: string;
  originCountry: string;
  slug: string;
};
