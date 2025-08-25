// src/features/account/api.ts
import type { ApiEnvelope, UserProfile } from "./types";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getUserById(id: number): Promise<UserProfile> {
  const res = await fetch(`${BASE}/api/v1/users/${id}`, {
    headers: { ...authHeaders() },
  });
  const json: ApiEnvelope<UserProfile> = await res.json();
  if (!res.ok) throw new Error((json as any)?.message || "Không tải được user");
  return json.data as unknown as UserProfile;
}

export async function updateUser(
  id: number,
  payload: Partial<UserProfile>
): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Cập nhật thất bại");
}
