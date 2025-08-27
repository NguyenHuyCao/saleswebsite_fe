import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "./api";
import type { UserProfile } from "./types";

export const QK = {
  user: (id: number) => ["account", "user", id] as const,
};

export function useUserProfile(id?: number) {
  return useQuery<UserProfile>({
    queryKey: id ? QK.user(id) : ["_disabled"],
    queryFn: () => getUserById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateUser(id?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UserProfile>) => updateUser(id!, payload),
    onSuccess: () => {
      if (id) qc.invalidateQueries({ queryKey: QK.user(id) });
    },
  });
}
