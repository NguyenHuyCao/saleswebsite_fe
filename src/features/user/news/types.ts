// src/features/news/types.ts
export type NewsPost = {
  id?: number;
  title: string;
  slug: string;
  image: string;
  /** seed dùng 'date', API trả 'publishedAt' → đều optional */
  date?: string;
  publishedAt?: string;
  excerpt?: string;
  content?: string;
};

export type MetaData = {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
};
export type ListNewsResponse = { result: NewsPost[]; meta?: MetaData | null };
