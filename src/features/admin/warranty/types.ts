// src/features/admin/warranty/types.ts
export type WarrantyStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface WarrantyClaim {
  id: number;
  issueDesc: string;
  status: WarrantyStatus | string;
  resolutionNote: string | null;
  adminMessage: string | null;
  imageUrl: string;
  validWarranty: boolean;
  userName: string;
}

export interface MetaData {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}
