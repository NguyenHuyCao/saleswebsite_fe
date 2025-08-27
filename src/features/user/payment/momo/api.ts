import { api } from "@/lib/api/http";
import type { MomoConfig } from "./types";

/**
 * Cố gắng đọc cấu hình MoMo từ BE.
 * - BE nên trả ApiEnvelope<MomoConfig> với path: /api/v1/payments/momo/config
 * - Nếu BE khác path, bạn chỉ cần sửa URL dưới đây.
 */
export async function getMomoConfig(): Promise<MomoConfig> {
  return await api.get<MomoConfig>("/api/v1/payments/momo/config");
}
