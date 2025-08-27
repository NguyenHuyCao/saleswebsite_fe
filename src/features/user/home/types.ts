export type Product = {
  id: number;
  name: string;
  slug: string;
  imageAvt: string;
  imageDetail1?: string | null;
  imageDetail2?: string | null;
  imageDetail3?: string | null;
  description?: string;
  price: number;
  pricePerUnit: number;
  originalPrice?: number;
  sale?: boolean;
  inStock?: boolean;
  label?: string;
  stockQuantity: number;
  totalStock: number;
  rating?: number;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  power?: string;
  fuelType?: string;
  engineType?: string;
  weight?: number;
  dimensions?: string;
  tankCapacity?: number;
  origin?: string;
  warrantyMonths?: number;
  status?: string[];
  favorite?: boolean;
};

export type Category = {
  id?: number;
  name: string;
  image: string;
  slug: string;
  title?: string; // để tương thích các nơi dùng title
};

export type CategoryWithProducts = {
  id: number;
  name: string;
  slug: string;
  image: string;
  products: Product[];
};

// export type Promotion = {
//   id: number | string;
//   name: string;
//   code?: string;
//   discount?: number;
//   maxDiscount?: number;
//   startDate?: string;
//   endDate?: string;
//   requiresCode?: boolean;
//   applicableProductIds?: number[];
//   [k: string]: any;
// };

// Type dùng chung cho tất cả component Home
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
