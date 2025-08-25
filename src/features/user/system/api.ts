// system/api.ts
import type { StoreInfo } from "./types";

/** Server helper – sau này có thể đổi sang đọc từ DB/Config service */
export async function getStoreInfo(): Promise<StoreInfo> {
  return {
    name: "Cửa Hàng Chính DolaTool",
    address: "7FGV+PM, Lục Nam District, Bắc Giang, Việt Nam",
    phone: "0909 123 456",
    hours: "Thứ 2 – Thứ 7: 8:00 – 17:30",
    status: "Còn hàng",
    coords: { lat: 21.274048, lng: 106.489299 },
  };
}
