// src/features/news/types.ts
export interface NewsPost {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  content?: string;
  image: string;
  date: string;
  publishedAt?: string;
  category?: string; // THÊM field này
  categories?: string[]; // Hoặc nếu có nhiều category
  author?: string;
  authorAvatar?: string;
  views?: number;
  comments?: number;
  tags?: string[];
}

export type MetaData = {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
};
export type ListNewsResponse = { result: NewsPost[]; meta?: MetaData | null };
