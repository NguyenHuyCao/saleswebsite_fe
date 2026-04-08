export type NewsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  tags?: string | null;
  status: NewsStatus;
  pinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface NewsListResponse {
  result: NewsArticle[];
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

export const NEWS_CATEGORIES = [
  "Kiến thức kỹ thuật",
  "Tin tức sản phẩm",
  "Hướng dẫn sử dụng",
  "Khuyến mãi & Ưu đãi",
  "Tin tức ngành",
] as const;

export const NEWS_STATUS_LABEL: Record<NewsStatus, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Lưu trữ",
};

export const NEWS_STATUS_COLOR: Record<NewsStatus, "default" | "success" | "error"> = {
  DRAFT: "default",
  PUBLISHED: "success",
  ARCHIVED: "error",
};
