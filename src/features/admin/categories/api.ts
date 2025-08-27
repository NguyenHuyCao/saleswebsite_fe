import { api } from "@/lib/api/http";
import type { Category, CategoryListResponse } from "./types";

/** Lấy danh sách danh mục (unwrap -> trả về { result, meta }) */
export async function fetchCategories(page = 1, size = 1000) {
  return api.get<CategoryListResponse>("/api/v1/categories", {
    params: { page, size },
  });
}

/** Tạo danh mục – gửi FormData */
export async function createCategory(fd: FormData) {
  return api.post<Category, FormData>("/api/v1/categories", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/** Cập nhật danh mục – gửi FormData */
export async function updateCategory(id: number, fd: FormData) {
  return api.put<Category, FormData>(`/api/v1/categories/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/** Xoá danh mục */
export async function deleteCategory(id: number) {
  // backend có thể trả data rỗng -> dùng void cũng được
  return api.delete<void>(`/api/v1/categories/${id}`);
}
