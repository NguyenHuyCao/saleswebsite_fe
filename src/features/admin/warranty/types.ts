export type WarrantyStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface WarrantyClaim {
  id: number;
  claimCode: string;
  status: WarrantyStatus | string;
  validWarranty: boolean;
  issueDesc: string;
  /** URL ảnh đầu tiên (backward compat) */
  imageUrl: string | null;
  /** Danh sách URL tất cả ảnh đính kèm (tối đa 3) */
  imageUrls: string[] | null;
  resolutionNote: string | null;
  adminMessage: string | null;
  orderCode: string | null;
  orderId: number | null;
  productId: number | null;
  productName: string | null;
  warrantyMonths: number;
  orderDate: string | null;
  deliveredAt: string | null;
  warrantyExpiry: string | null;
  userEmail: string | null;
  userName: string | null;
  userPhone: string | null;
  submittedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MetaData {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface PagedWarrantyClaims {
  result: WarrantyClaim[];
  meta: MetaData;
}
