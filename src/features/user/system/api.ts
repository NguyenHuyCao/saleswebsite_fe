// system/api.ts
import type { StoreInfo } from "./types";

/** Server helper – sau này có thể đổi sang đọc từ DB/Config service */
export async function getStoreInfo(): Promise<StoreInfo> {
  return {
    id: "store-001",
    name: "Cửa Hàng Chính DolaTool",
    address: "7FGV+PM, Lục Nam District, Bắc Giang, Việt Nam",
    phone: "0909 123 456",
    email: "info@dolatool.vn",
    hours: {
      monday: "8:00 - 17:30",
      tuesday: "8:00 - 17:30",
      wednesday: "8:00 - 17:30",
      thursday: "8:00 - 17:30",
      friday: "8:00 - 17:30",
      saturday: "8:00 - 17:30",
      sunday: "9:00 - 12:00",
    },
    manager: "Nguyễn Văn A",
    managerPhone: "0912 345 678",
    images: [
      "/images/stores/main-store-1.jpg",
      "/images/stores/main-store-2.jpg",
      "/images/stores/main-store-3.jpg",
      "/images/stores/main-store-4.jpg",
    ],
    services: ["Bảo hành", "Sửa chữa", "Tư vấn", "Giao hàng"],
    policies: {
      return: "Đổi trả trong 7 ngày",
      warranty: "Bảo hành 12 tháng",
      repair: "Sửa chữa trọn đời",
    },
    rating: 4.8,
    totalRatings: 1250,
    coords: { lat: 21.274048, lng: 106.489299 },
    promotions: [
      {
        title: "Giảm 20% cho đơn hàng đầu tiên",
        description: "Áp dụng cho khách hàng mới tại cửa hàng",
        validUntil: "31/12/2024",
      },
      {
        title: "Mua máy cắt cỏ tặng phụ kiện",
        description: "Tặng dây cắt, kính bảo hộ và găng tay",
        validUntil: "30/06/2024",
      },
    ],
  };
}

/**
 * Lấy danh sách tất cả cửa hàng
 * Sau này sẽ kết nối với database thực tế
 */
export async function getAllStores(): Promise<StoreInfo[]> {
  // Mock data cho nhiều cửa hàng
  return [
    {
      id: "store-001",
      name: "Cửa Hàng Chính DolaTool",
      address: "7FGV+PM, Lục Nam District, Bắc Giang, Việt Nam",
      phone: "0909 123 456",
      email: "info@dolatool.vn",
      hours: {
        monday: "8:00 - 17:30",
        tuesday: "8:00 - 17:30",
        wednesday: "8:00 - 17:30",
        thursday: "8:00 - 17:30",
        friday: "8:00 - 17:30",
        saturday: "8:00 - 17:30",
        sunday: "9:00 - 12:00",
      },
      manager: "Nguyễn Văn A",
      managerPhone: "0912 345 678",
      images: [
        "/images/stores/main-store-1.jpg",
        "/images/stores/main-store-2.jpg",
      ],
      services: ["Bảo hành", "Sửa chữa", "Tư vấn"],
      policies: {
        return: "Đổi trả trong 7 ngày",
        warranty: "Bảo hành 12 tháng",
        repair: "Sửa chữa trọn đời",
      },
      rating: 4.8,
      totalRatings: 1250,
      coords: { lat: 21.274048, lng: 106.489299 },
    },
    {
      id: "store-002",
      name: "DolaTool Hà Nội",
      address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      phone: "024 1234 5678",
      email: "hanoi@dolatool.vn",
      hours: {
        monday: "8:00 - 20:00",
        tuesday: "8:00 - 20:00",
        wednesday: "8:00 - 20:00",
        thursday: "8:00 - 20:00",
        friday: "8:00 - 20:00",
        saturday: "8:00 - 20:00",
        sunday: "9:00 - 17:00",
      },
      manager: "Trần Thị B",
      managerPhone: "0987 654 321",
      images: [
        "/images/stores/hanoi-store-1.jpg",
        "/images/stores/hanoi-store-2.jpg",
      ],
      services: ["Bảo hành", "Tư vấn", "Giao hàng"],
      policies: {
        return: "Đổi trả trong 7 ngày",
        warranty: "Bảo hành 12 tháng",
        repair: "Sửa chữa cơ bản",
      },
      rating: 4.7,
      totalRatings: 890,
      coords: { lat: 20.998932, lng: 105.801278 },
    },
    {
      id: "store-003",
      name: "DolaTool TP.HCM",
      address: "456 Lê Lợi, Quận 1, TP.HCM",
      phone: "028 5678 1234",
      email: "hcm@dolatool.vn",
      hours: {
        monday: "8:00 - 21:00",
        tuesday: "8:00 - 21:00",
        wednesday: "8:00 - 21:00",
        thursday: "8:00 - 21:00",
        friday: "8:00 - 21:00",
        saturday: "8:00 - 21:00",
        sunday: "9:00 - 18:00",
      },
      manager: "Lê Văn C",
      managerPhone: "0909 888 777",
      images: [
        "/images/stores/hcm-store-1.jpg",
        "/images/stores/hcm-store-2.jpg",
      ],
      services: ["Bảo hành", "Sửa chữa", "Tư vấn", "Giao hàng", "Cho thuê"],
      policies: {
        return: "Đổi trả trong 7 ngày",
        warranty: "Bảo hành 12 tháng",
        repair: "Sửa chữa trọn đời",
      },
      rating: 4.9,
      totalRatings: 2100,
      coords: { lat: 10.776389, lng: 106.701111 },
    },
    {
      id: "store-004",
      name: "DolaTool Đà Nẵng",
      address: "789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
      phone: "0236 987 654",
      email: "danang@dolatool.vn",
      hours: {
        monday: "8:00 - 19:00",
        tuesday: "8:00 - 19:00",
        wednesday: "8:00 - 19:00",
        thursday: "8:00 - 19:00",
        friday: "8:00 - 19:00",
        saturday: "8:00 - 19:00",
        sunday: "9:00 - 16:00",
      },
      manager: "Phạm Thị D",
      managerPhone: "0912 345 678",
      images: [
        "/images/stores/danang-store-1.jpg",
        "/images/stores/danang-store-2.jpg",
      ],
      services: ["Bảo hành", "Tư vấn", "Giao hàng"],
      policies: {
        return: "Đổi trả trong 7 ngày",
        warranty: "Bảo hành 12 tháng",
        repair: "Sửa chữa cơ bản",
      },
      rating: 4.6,
      totalRatings: 560,
      coords: { lat: 16.054622, lng: 108.202835 },
    },
  ];
}

/**
 * Lấy thông tin cửa hàng theo ID
 */
export async function getStoreById(id: string): Promise<StoreInfo | null> {
  const stores = await getAllStores();
  return stores.find((store) => store.id === id) || null;
}

/**
 * Tìm cửa hàng theo tỉnh/thành phố
 */
export async function getStoresByCity(city: string): Promise<StoreInfo[]> {
  const stores = await getAllStores();
  return stores.filter((store) =>
    store.address.toLowerCase().includes(city.toLowerCase()),
  );
}
