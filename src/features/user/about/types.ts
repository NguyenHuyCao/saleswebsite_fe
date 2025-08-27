// Định nghĩa dữ liệu cho trang About (có thể mở rộng khi backend cung cấp)
export type GalleryItem = string;

export type Testimonial = {
  name: string;
  job: string;
  avatar: string;
  comment: string;
};

export type TwoStrokeFeature = {
  key: string; // ví dụ: "power", "maintain", "price"
  title: string; // tiêu đề hiển thị
};

export type AboutContent = {
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  features: TwoStrokeFeature[];
};

// Gửi log CTA
export type CtaClickPayload = {
  name: string; // key CTA
  pageUrl: string; // URL hiện tại
  ts?: number; // timestamp
};
