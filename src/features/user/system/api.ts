// system/api.ts
import type { StoreInfo } from "./types";

const STORE: StoreInfo = {
  id: "store-001",
  name: "Cửa hàng máy 2 thì Cường Hoa",
  address: "293 TL293, Nghĩa Phương, Bắc Ninh, Việt Nam",
  phone: "0392923392",
  email: "support@cuonghoa.vn",
  hours: {
    monday:    "7:00 - 18:00",
    tuesday:   "7:00 - 18:00",
    wednesday: "7:00 - 18:00",
    thursday:  "7:00 - 18:00",
    friday:    "7:00 - 18:00",
    saturday:  "7:00 - 18:00",
    sunday:    "7:00 - 17:00",
  },
  images: [
    "/images/about/1534231926-5.jpg",
    "/images/about/cua-betong-gs461.jpg",
  ],
  services: ["Bán máy 2 thì", "Sửa chữa máy", "Bảo hành", "Tư vấn", "Giao hàng"],
  policies: {
    return: "Đổi trả trong 7 ngày",
    warranty: "Bảo hành 6 – 12 tháng",
    repair: "Sửa chữa trọn đời",
  },
  manager: "Cường Hoa",
  managerPhone: "0392923392",
  rating: 4.9,
  totalRatings: 180,
  coords: { lat: 21.1167, lng: 106.0667 },
  promotions: [
    {
      title: "Mua máy tặng phụ kiện",
      description: "Tặng dây cắt, kính bảo hộ và găng tay khi mua máy cắt cỏ",
      validUntil: "31/12/2025",
    },
  ],
};

export async function getStoreInfo(): Promise<StoreInfo> {
  return STORE;
}

export async function getAllStores(): Promise<StoreInfo[]> {
  return [STORE];
}

export async function getStoreById(id: string): Promise<StoreInfo | null> {
  return id === STORE.id ? STORE : null;
}

export async function getStoresByCity(city: string): Promise<StoreInfo[]> {
  return STORE.address.toLowerCase().includes(city.toLowerCase()) ? [STORE] : [];
}
