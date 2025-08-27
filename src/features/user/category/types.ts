// src/features/user/category/types.ts
export type PageMeta = {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
};

export type Paged<T> = {
  meta: PageMeta;
  result: T[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
