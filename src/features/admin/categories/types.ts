export type Category = {
  id: number;
  name: string;
  image: string | null;
  slug?: string | null;
  description?: string | null;
  active?: boolean;
  brandId?: number | null;
  brandName?: string | null;
  brandSlug?: string | null;
  productCount?: number;
  createdAt: string;
  updatedAt: string | null;
};

export type CategoryListResponse = {
  result: Category[];
  meta: { page: number; pageSize: number; pages: number; total: number };
};
