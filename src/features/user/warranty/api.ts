// warranty/api.ts
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

/** Tra cứu thông tin bảo hành theo mã đơn hàng */
export async function lookupWarranty(orderCode: string) {
  if (!orderCode) throw new Error("Vui lòng nhập mã đơn hàng");

  try {
    const data = await api.get<any>(`/api/v1/warranty/lookup/${orderCode}`);

    // Format dữ liệu trả về
    return {
      orderCode: data?.orderCode || orderCode,
      orderDate: data?.orderDate || "N/A",
      customerName: data?.customerName || "",
      items: Array.isArray(data?.items)
        ? data.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            purchaseDate: item.purchaseDate || data?.orderDate,
            expiryDate: item.warrantyExpiry,
            status: item.warrantyStatus || "active",
            warrantyMonths: item.warrantyMonths,
          }))
        : [],
    };
  } catch (error) {
    // Mock data cho development (khi chưa có API thật)
    if (process.env.NODE_ENV === "development") {
      return mockWarrantyLookup(orderCode);
    }
    throw error;
  }
}

/** Lấy lịch sử yêu cầu bảo hành của người dùng */
export async function getUserWarrantyRequests() {
  try {
    const data = await api.get<any>("/api/v1/warranty/user-requests");

    return Array.isArray(data)
      ? data.map((req: any) => ({
          id: req.id,
          code: req.requestCode || `BH-${req.id}`,
          createdAt: new Date(req.createdAt).toLocaleDateString("vi-VN"),
          productName: req.productName,
          status:
            req.status === "completed"
              ? "Hoàn thành"
              : req.status === "processing"
                ? "Đang xử lý"
                : req.status === "pending"
                  ? "Chờ xử lý"
                  : req.status || "Chờ xử lý",
          details: req,
        }))
      : [];
  } catch (error) {
    // Mock data cho development
    if (process.env.NODE_ENV === "development") {
      return mockWarrantyRequests();
    }
    return [];
  }
}

/** Lấy chi tiết yêu cầu bảo hành theo ID */
export async function getWarrantyRequestDetail(requestId: string) {
  try {
    const data = await api.get<any>(`/api/v1/warranty/request/${requestId}`);
    return data;
  } catch (error) {
    console.error("Error fetching warranty request detail:", error);
    throw error;
  }
}

/** Hủy yêu cầu bảo hành */
export async function cancelWarrantyRequest(requestId: string) {
  try {
    const res = await http.post(`/api/v1/warranty/request/${requestId}/cancel`);
    return {
      success: res.status === 200,
      message: res.data?.message || "Đã hủy yêu cầu thành công",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Không thể hủy yêu cầu",
    };
  }
}

/** Lấy danh sách trung tâm bảo hành */
export async function getWarrantyCenters() {
  try {
    const data = await api.get<any>("/api/v1/warranty/centers");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Mock data cho development
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
}

// ==================== MOCK DATA ====================

function mockWarrantyLookup(orderCode: string) {
  const mockItems = [
    {
      productId: "prod-001",
      productName: "Máy cắt cỏ Husqvarna 128R",
      purchaseDate: "15/01/2024",
      expiryDate: "15/01/2026",
      status: "active",
      warrantyMonths: 24,
    },
    {
      productId: "prod-002",
      productName: "Máy khoan pin Makita DHP482",
      purchaseDate: "20/02/2023",
      expiryDate: "20/02/2024",
      status: "expired",
      warrantyMonths: 12,
    },
    {
      productId: "prod-003",
      productName: "Máy cưa xích Stihl MS 170",
      purchaseDate: "10/03/2024",
      expiryDate: "10/03/2025",
      status: "active",
      warrantyMonths: 12,
    },
  ];

  return {
    orderCode,
    orderDate: "15/03/2024",
    customerName: "Nguyễn Văn A",
    items: mockItems,
  };
}

function mockWarrantyRequests() {
  return [
    {
      id: "req-001",
      requestCode: "BH-2024-001",
      createdAt: "15/03/2024",
      productName: "Máy cắt cỏ Husqvarna 128R",
      status: "Hoàn thành",
    },
    {
      id: "req-002",
      requestCode: "BH-2024-002",
      createdAt: "10/03/2024",
      productName: "Máy khoan pin Makita DHP482",
      status: "Đang xử lý",
    },
    {
      id: "req-003",
      requestCode: "BH-2024-003",
      createdAt: "05/03/2024",
      productName: "Máy cưa xích Stihl MS 170",
      status: "Chờ xử lý",
    },
  ];
}
