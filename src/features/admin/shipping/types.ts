export interface ShippingPartner {
  id: number;
  name: string;
  code: string;
  apiUrl: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export type CreateShippingPartner = {
  name: string;
  code: string; // chỉ tạo mới cần code
  apiUrl: string | null;
  active: boolean;
};

export type UpdateShippingPartner = {
  name: string;
  apiUrl: string | null;
  active: boolean;
};
