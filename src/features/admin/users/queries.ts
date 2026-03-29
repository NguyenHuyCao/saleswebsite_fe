import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiListUsers,
  apiGetUser,
  apiUpdateUser,
  apiToggleActive,
  apiDeleteUser,
  apiChangePassword,
} from "./api";
import type { User } from "./types";
import type { ChangePasswordInput } from "@/features/user/auth";

export const QK = {
  users: ["admin", "users"] as const,
  user: (id: string | number) => ["admin", "users", String(id)] as const,
};

export function useUsers() {
  return useQuery<User[]>({
    queryKey: QK.users,
    queryFn: apiListUsers,
  });
}

export function useUser(id?: string | number | null) {
  return useQuery<User>({
    queryKey: id ? QK.user(id) : ["_disabled", "user"],
    queryFn: () => apiGetUser(String(id)),
    enabled: !!id,
  });
}

export function useUpdateUser(userId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<User>) => apiUpdateUser(String(userId), body),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: QK.user(userId) }),
        qc.invalidateQueries({ queryKey: QK.users }),
      ]);
    },
  });
}

export function useToggleActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      apiToggleActive(id, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.users }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiDeleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.users }),
  });
}

export function useChangePassword(userId: string | number) {
  return useMutation<void, Error, ChangePasswordInput>({
    mutationFn: (p) =>
      apiChangePassword(String(userId), {
        currentPassword: p.currentPassword,
        newPassword: p.newPassword,
        confirmPassword: p.confirmPassword,
      }),
  });
}
