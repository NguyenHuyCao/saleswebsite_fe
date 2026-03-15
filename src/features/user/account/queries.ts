// features/user/account/queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser, getUserStats } from "./api";
import type { UserProfile, UserStats } from "./types";

export const QK = {
  user: (id: number) => ["account", "user", id] as const,
  stats: (id: number) => ["account", "stats", id] as const,
};

export function useUserProfile(id?: number) {
  return useQuery<UserProfile>({
    queryKey: id ? QK.user(id) : ["_disabled"],
    queryFn: () => getUserById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 phút
  });
}

export function useUserStats(id?: number) {
  return useQuery<UserStats>({
    queryKey: id ? QK.stats(id) : ["_disabled"],
    queryFn: () => getUserStats(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateUser(id?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UserProfile>) => updateUser(id!, payload),
    onSuccess: () => {
      if (id) {
        qc.invalidateQueries({ queryKey: QK.user(id) });
        qc.invalidateQueries({ queryKey: QK.stats(id) });
      }
    },
  });
}
