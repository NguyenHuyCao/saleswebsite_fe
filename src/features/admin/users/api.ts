import { api, http } from "@/lib/api/http";
import type { PagedResp, User } from "./types";

export async function apiListUsers(): Promise<User[]> {
  const data = await api.get<PagedResp<User>>("/api/v1/users", {
    params: { page: 1, size: 1000 },
  });
  return data?.result ?? [];
}

export async function apiGetUser(userId: string | number): Promise<User> {
  return api.get<User>(`/api/v1/users/${userId}`);
}

export async function apiUpdateUser(
  userId: string | number,
  body: Partial<User>
): Promise<User> {
  return api.put<User>(`/api/v1/users/${userId}`, body);
}

export async function apiToggleActive(
  userId: string | number,
  active: boolean
): Promise<User> {
  return api.patch<User>(`/api/v1/users/${userId}/active`, null, {
    params: { active },
  });
}

export async function apiDeleteUser(userId: string | number): Promise<void> {
  await http.delete(`/api/v1/users/${userId}`);
}

export async function apiChangePassword(
  userId: string | number,
  payload: { currentPassword: string; newPassword: string; confirmPassword: string }
): Promise<void> {
  await http.post(`/api/v1/users/change_password`, payload, {
    params: { userId: String(userId) },
  });
}
