export type Category = {
  id: number;
  name: string;
  slug?: string | null;
  image: string | null;
  description?: string | null;
  active?: boolean;
  productCount?: number;
  brandId?: number | null;
  brandName?: string | null;
  brandSlug?: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CategoryListResponse = {
  result: Category[];
  meta: { page: number; pageSize: number; pages: number; total: number };
};
