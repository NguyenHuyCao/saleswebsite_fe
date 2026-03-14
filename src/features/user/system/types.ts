// system/types.ts
// export type StoreInfo = {
//   name: string;
//   address: string;
//   phone: string;
//   hours: string;
//   status: string;
//   coords: { lat: number; lng: number };
// };

// types.ts
export interface StoreInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coords: {
    lat: number;
    lng: number;
  };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    holiday?: string;
  };
  manager: string;
  managerPhone: string;
  images: string[];
  services: string[];
  policies: {
    return: string;
    warranty: string;
    repair: string;
  };
  rating: number;
  totalRatings: number;
  distance?: number; // for nearest store calculation
  promotions?: {
    title: string;
    description: string;
    validUntil: string;
  }[];
}

export interface StoreListApiResponse {
  status: number;
  message: string;
  data: {
    stores: StoreInfo[];
    meta: {
      total: number;
      page: number;
      pageSize: number;
    };
  };
}