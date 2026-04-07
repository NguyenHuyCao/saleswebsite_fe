export interface Brand {
  id: number;
  name: string;
  logo: string;
  website?: string | null;
  originCountry?: string | null;
  description?: string | null;
  year?: string | null;
  active?: boolean;
  slug?: string | null;
  productCount?: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface Meta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface BrandListResponse {
  result: Brand[];
  meta: Meta;
}
