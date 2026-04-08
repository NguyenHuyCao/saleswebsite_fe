// src/features/user/news/types.ts

export type NewsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface NewsPost {
  id: number;
  title: string;
  slug: string;
  /** Tóm tắt hiển thị ở danh sách */
  summary?: string | null;
  /** Alias để tương thích với các component cũ */
  excerpt?: string | null;
  /** Nội dung HTML đầy đủ */
  content?: string | null;
  thumbnail?: string | null;
  /** Alias để tương thích với các component cũ */
  image?: string | null;
  category?: string | null;
  tags?: string | null;
  status: NewsStatus;
  pinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string | null;
  createdBy?: string | null;
}

export type MetaData = {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
};

export type ListNewsResponse = {
  result: NewsPost[];
  meta?: MetaData | null;
};
