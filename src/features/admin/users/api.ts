// src/features/admin/users/api.ts
import type { ApiEnvelope, PagedResp, User } from "./types";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function apiListUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/api/v1/users?page=1&size=1000`, {
    headers: { ...authHeaders() },
  });
  const json: ApiEnvelope<PagedResp<User>> = await res.json();
  if (!res.ok) throw new Error((json as any)?.message || "Tải danh sách lỗi");
  const list = json?.data?.result ?? [];
  // loại bỏ admin nếu cần
  return list.filter((u) => u.email !== "admin@gmail.com");
}

export async function apiGetUser(userId: string): Promise<User> {
  const res = await fetch(`${BASE}/api/v1/users/${userId}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  const json: ApiEnvelope<User> = await res.json();
  if (!res.ok || json.status !== 200)
    throw new Error(json?.message || "Không lấy được người dùng");
  return json.data;
}

export async function apiUpdateUser(
  userId: string,
  body: Partial<User>
): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Cập nhật thất bại");
}

export async function apiChangePassword(
  userId: string,
  payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
): Promise<void> {
  const res = await fetch(
    `${BASE}/api/v1/users/change_password?userId=${encodeURIComponent(userId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Đổi mật khẩu thất bại");
}
