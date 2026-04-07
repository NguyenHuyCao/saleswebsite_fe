export type ProductRef = { id: number; name: string; slug: string };
export type CategoryRef = {
  id: number;
  name: string;
  slug: string;
  products: ProductRef[];
};

export type Brand = {
  id: number;
  name: string;
  logo: string;
  website: string | null;
  originCountry: string;
  description: string | null;
  year: number | string | null;
  slug: string;
  active: boolean;
  productCount: number;
  createdAt: string | null;
  updatedAt: string | null;
  category: CategoryRef[];
};

export type Meta = {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
};

export type BrandListApiResponse = {
  status: number;
  message: string;
  data: {
    meta: Meta;
    result: Brand[];
  };
};
