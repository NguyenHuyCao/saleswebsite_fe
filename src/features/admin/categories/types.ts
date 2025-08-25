export type Category = {
  id: number;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CategoryListResponse = {
  result: Category[];
  meta: { page: number; pageSize: number; pages: number; total: number };
};
