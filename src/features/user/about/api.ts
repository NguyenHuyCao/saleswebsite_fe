import { api } from "@/lib/api/http";
import type { AboutContent, CtaClickPayload } from "./types";

// (Tùy chọn) nếu sau này backend có API content cho trang About thì dùng endpoint này
const CONTENT_ENDPOINT = "/api/v1/about/content";
const CTA_ENDPOINT = "/api/v1/cta_click";

// Lấy dữ liệu About. Nếu backend chưa có, fallback sang constants cục bộ
export async function fetchAboutContent(): Promise<AboutContent> {
  try {
    return await api.get<AboutContent>(CONTENT_ENDPOINT);
  } catch {
    // Fallback: lấy từ constants sẵn có
    const { gallery } = await import("./constants/gallery");
    const { testimonials } = await import("./constants/testimonials");
    const { whyTwoStroke } = await import("./constants/features");
    return {
      gallery,
      testimonials,
      features: whyTwoStroke.map((f, i) => ({
        key: String(i),
        title: f.title,
      })),
    };
  }
}

// Gửi log CTA
export async function sendCtaClick(payload: CtaClickPayload): Promise<void> {
  try {
    await api.post<void, CtaClickPayload>(CTA_ENDPOINT, payload);
  } catch {
    // im lặng – không chặn luồng UI
  }
}
