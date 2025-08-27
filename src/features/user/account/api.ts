import { api } from "@/lib/api/http";
import type { UserProfile } from "./types";

export async function getUserById(id: number): Promise<UserProfile> {
  // api.get đã unwrap -> trả thẳng UserProfile
  return api.get<UserProfile>(`/api/v1/users/${id}`);
}

export async function updateUser(
  id: number,
  payload: Partial<UserProfile>
): Promise<void> {
  await api.put<void, Partial<UserProfile>>(`/api/v1/users/${id}`, payload);
}
