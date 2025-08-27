// Không dùng "use server" vì module này được gọi từ client components
import { api, http } from "@/lib/api/http";

/** Lấy danh sách sản phẩm trong đơn theo mã đơn hàng */
export async function getOrderItems(orderCode: string) {
  if (!orderCode) return [];
  try {
    // Backend có thể trả {data:{items}}; api.get đã unwrap -> trả ra data bên trong
    const data = await api.get<any>(`/api/v1/orders/${orderCode}`);
    const items =
      data?.items ?? data?.orderItems ?? data?.products ?? data?.data?.items;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

/** Gửi yêu cầu bảo hành (có upload ảnh) */
export async function submitWarrantyClaim(formData: FormData) {
  // Dùng http.post trực tiếp để KHÔNG unwrap (vì nhiều API bảo hành chỉ trả message/status)
  const res = await http.post(`/api/v1/warranty_claim`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const body: any = res?.data ?? {};
  return {
    status: body?.status ?? res.status,
    message: body?.message ?? "OK",
    data: body?.data ?? null,
  };
}
