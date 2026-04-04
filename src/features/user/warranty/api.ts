// warranty/api.ts
import { api } from "@/lib/api/http";

export interface WarrantyItem {
  id?: number;
  claimCode?: string;
  orderCode: string;
  orderId?: number;
  orderDate?: string;
  deliveredAt?: string;
  productId: number;
  productName: string;
  warrantyMonths: number;
  warrantyExpiry?: string;
  validWarranty: boolean;
  // Claim info (nếu đã gửi yêu cầu)
  status?: string;
  issueDesc?: string;
  resolutionNote?: string;
  adminMessage?: string;
  submittedAt?: string;
}

export interface WarrantyClaimResponse {
  id: number;
  claimCode: string;
  status: string;
  validWarranty: boolean;
  issueDesc: string;
  imageUrl?: string;
  resolutionNote?: string;
  adminMessage?: string;
  orderCode: string;
  orderId?: number;
  productId?: number;
  productName?: string;
  warrantyMonths?: number;
  orderDate?: string;
  deliveredAt?: string;
  warrantyExpiry?: string;
  userEmail?: string;
  userName?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Lấy danh sách sản phẩm trong đơn hàng theo mã đơn.
 * Endpoint: GET /api/v1/orders/by-code/{orderCode}
 */
export async function getOrderItems(orderCode: string): Promise<any[]> {
  if (!orderCode) return [];
  try {
    const data = await api.get<any>(`/api/v1/orders/by-code/${orderCode}`);
    const items = data?.items ?? data?.orderItems ?? [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

/**
 * Gửi yêu cầu bảo hành.
 * Endpoint: POST /api/v1/warranty-claims (multipart/form-data)
 * FormData phải chứa: orderCode, email, productId, issueDesc, image (optional)
 */
export async function submitWarrantyClaim(
  formData: FormData
): Promise<WarrantyClaimResponse> {
  return api.post<WarrantyClaimResponse>(`/api/v1/warranty-claims`, formData);
}

/**
 * Tra cứu thông tin bảo hành theo mã đơn hàng.
 * Endpoint: GET /api/v1/warranty-claims/lookup/{orderCode}
 * Trả về mỗi sản phẩm trong đơn kèm trạng thái bảo hành.
 */
export async function lookupWarranty(orderCode: string): Promise<{
  orderCode: string;
  items: WarrantyItem[];
}> {
  if (!orderCode) throw new Error("Vui lòng nhập mã đơn hàng");

  const data = await api.get<WarrantyClaimResponse[]>(
    `/api/v1/warranty-claims/lookup/${orderCode}`
  );

  const items: WarrantyItem[] = (Array.isArray(data) ? data : []).map((item) => ({
    id: item.id,
    claimCode: item.claimCode,
    orderCode: item.orderCode ?? orderCode,
    orderId: item.orderId,
    orderDate: item.orderDate,
    deliveredAt: item.deliveredAt,
    productId: item.productId ?? 0,
    productName: item.productName ?? "",
    warrantyMonths: item.warrantyMonths ?? 0,
    warrantyExpiry: item.warrantyExpiry,
    validWarranty: item.validWarranty ?? false,
    status: item.status,
    issueDesc: item.issueDesc,
    resolutionNote: item.resolutionNote,
    adminMessage: item.adminMessage,
    submittedAt: item.submittedAt,
  }));

  return { orderCode, items };
}

/**
 * Lấy lịch sử yêu cầu bảo hành của người dùng hiện tại.
 * Endpoint: GET /api/v1/warranty-claims/me
 */
export async function getUserWarrantyRequests(): Promise<WarrantyClaimResponse[]> {
  const data = await api.get<WarrantyClaimResponse[]>("/api/v1/warranty-claims/me");
  return Array.isArray(data) ? data : [];
}

/**
 * Chi tiết 1 yêu cầu bảo hành.
 * Endpoint: GET /api/v1/warranty-claims/{id}
 */
export async function getWarrantyRequestDetail(
  requestId: string | number
): Promise<WarrantyClaimResponse> {
  return api.get<WarrantyClaimResponse>(`/api/v1/warranty-claims/${requestId}`);
}

/**
 * Huỷ yêu cầu bảo hành đang PENDING.
 * Endpoint: POST /api/v1/warranty-claims/{id}/cancel
 */
export async function cancelWarrantyRequest(requestId: string | number): Promise<void> {
  await api.post(`/api/v1/warranty-claims/${requestId}/cancel`, {});
}

/** Danh sách trung tâm bảo hành (static) */
export function getWarrantyCenters() {
  return [
    {
      id: 1,
      name: "Trung tâm bảo hành Bắc Giang",
      address: "293 TL293, Nghĩa Phương, Lục Nam, Bắc Giang",
      phone: "0204 123 456",
      hours: "Thứ 2 - Thứ 7: 8:00 - 17:30",
    },
    {
      id: 2,
      name: "Trung tâm bảo hành Hà Nội",
      address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      phone: "024 1234 5678",
      hours: "Thứ 2 - Thứ 7: 8:00 - 20:00",
    },
    {
      id: 3,
      name: "Trung tâm bảo hành TP.HCM",
      address: "456 Lê Lợi, Quận 1, TP.HCM",
      phone: "028 5678 1234",
      hours: "Thứ 2 - Thứ 7: 8:00 - 21:00",
    },
  ];
}
