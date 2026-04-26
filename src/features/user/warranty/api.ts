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
  imageUrls?: string[];
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
  userPhone?: string;
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

/** Chi nhánh bảo hành chính (static) */
export function getWarrantyCenters() {
  return [
    {
      id: 1,
      name: "Cửa hàng máy 2 thì Cường Hoa",
      address: "293 TL293, Nghĩa Phương, Lục Nam, Bắc Ninh",
      phone: "0392 923 392",
      hours: "Thứ 2 – Chủ nhật: 7:00 – 18:00",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=293+TL293+Nghi%C3%A3+Ph%C6%B0%C6%A1ng+B%E1%BA%AFc+Ninh",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44565.070290525546!2d106.44437623455282!3d21.273365680042907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313563aab2f52ee1%3A0x1f80e44dc4bbf9b5!2zQ8ar4bucTkcgSE9BIFPhu6xBIEPGr0EgTOG7kEM!5e0!3m2!1sen!2sus!4v1748509785866!5m2!1sen!2sus",
    },
  ];
}
