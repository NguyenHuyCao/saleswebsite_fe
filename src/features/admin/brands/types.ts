export interface Brand {
  id: number;
  name: string;
  logo: string;
  website?: string | null;
  originCountry?: string | null;
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
