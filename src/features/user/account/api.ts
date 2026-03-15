// features/user/account/api.ts
import { api } from "@/lib/api/http";
import type { UserProfile, UserStats } from "./types";

export async function getUserById(id: number): Promise<UserProfile> {
  return api.get<UserProfile>(`/api/v1/users/${id}`);
}

export async function updateUser(
  id: number,
  payload: Partial<UserProfile>,
): Promise<void> {
  await api.put<void, Partial<UserProfile>>(`/api/v1/users/${id}`, payload);
}

export async function getUserStats(id: number): Promise<UserStats> {
  try {
    const data = await api.get<UserStats>(`/api/v1/users/${id}/stats`);
    return data;
  } catch (error) {
    // Mock data cho development - sẽ bị lỗi TypeScript nếu không có
    if (process.env.NODE_ENV === "development") {
      console.warn("Using mock stats data - API endpoint not available");
      return {
        totalOrders: 42,
        wishlistCount: 11,
        totalSpent: 427644703,
      };
    }
    throw error;
  }
}
