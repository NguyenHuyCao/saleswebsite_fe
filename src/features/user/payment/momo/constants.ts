import type { MomoConfig } from "./types";

/** Fallback nếu BE chưa cấp endpoint config */
export const DEFAULT_MOMO_INFO: MomoConfig = {
  ownerName: "Nguyễn Văn A",
  phone: "0901 234 567",
  noteFormat: "[Họ tên] - [Tên sản phẩm]",
  validWithinMins: 15,
  qrSrc: "/images/momo/qr_momo.jpeg",
};
