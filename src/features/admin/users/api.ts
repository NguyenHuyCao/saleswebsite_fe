import { api, http } from "@/lib/api/http";
import type { PagedResp, User } from "./types";

/** Lấy tất cả users (lọc bỏ admin nếu cần) */
export async function apiListUsers(): Promise<User[]> {
  const data = await api.get<PagedResp<User>>("/api/v1/users", {
    params: { page: 1, size: 1000 },
  });
  const list = data?.result ?? [];
  return list.filter((u) => u.email !== "admin@gmail.com");
}

/** Lấy chi tiết 1 user */
export async function apiGetUser(userId: string | number): Promise<User> {
  return api.get<User>(`/api/v1/users/${userId}`);
}

/** Cập nhật user – endpoint không đảm bảo có data => dùng http trực tiếp */
export async function apiUpdateUser(
  userId: string | number,
  body: Partial<User>
): Promise<void> {
  await http.put(`/api/v1/users/${userId}`, body);
}

/** Đổi mật khẩu – dùng query param userId như backend yêu cầu */
export async function apiChangePassword(
  userId: string | number,
  payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
): Promise<void> {
  await http.post(`/api/v1/users/change_password`, payload, {
    params: { userId: String(userId) },
  });
}
