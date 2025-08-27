import { api } from "@/lib/api/http";
import type { Brand, BrandListResponse } from "./types";

/** Lấy danh sách brand (unwrap sẵn -> trả về { result, meta }) */
export async function getBrands(params?: { page?: number; size?: number }) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 1000;
  return api.get<BrandListResponse>("/api/v1/brands", {
    params: { page, size },
  });
}

/** Tạo brand – payload là FormData */
export async function createBrand(fd: FormData) {
  // override Content-Type để upload multipart, không dùng header JSON mặc định
  return api.post<Brand, FormData>("/api/v1/brands", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/** Cập nhật brand – payload là FormData */
export async function updateBrand(id: number, fd: FormData) {
  return api.put<Brand, FormData>(`/api/v1/brands/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
