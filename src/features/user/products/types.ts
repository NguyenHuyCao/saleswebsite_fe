// product/types.ts
export type Product = {
  id: number;
  name: string;
  slug: string;
  imageAvt: string;
  imageDetail1?: string;
  imageDetail2?: string;
  imageDetail3?: string;
  description?: string;

  // Giá đã đồng bộ: price hiển thị (đã áp khuyến mãi), originalPrice là giá gốc
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
  updatedBy?: string;
  rating?: number;
  status: string[];
  favorite?: boolean;
};

export type Category = {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  products: Product[];
};

export type CategoryWithProducts = Category;

export type Brand = {
  id: number;
  name: string;
  logo: string;
  originCountry: string;
  slug?: string;
};
