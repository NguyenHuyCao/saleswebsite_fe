// src/features/admin/shipping/types.ts
export interface ShippingPartner {
  id: number;
  name: string;
  code: string;
  apiUrl: string | null;
  active: boolean;
}

export interface ApiResp<T> {
  message: string;
  data: T;
}
