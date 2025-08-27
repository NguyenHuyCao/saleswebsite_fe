import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiListUsers,
  apiGetUser,
  apiUpdateUser,
  apiChangePassword,
} from "./api";
import type { User } from "./types";

export const QK = {
  users: ["admin", "users"] as const,
  user: (id: string | number) => ["admin", "users", String(id)] as const,
};

/** Danh sách người dùng */
export function useUsers() {
  return useQuery<User[]>({
    queryKey: QK.users,
    queryFn: apiListUsers,
  });
}

/** Chi tiết 1 user */
export function useUser(id?: string | number | null) {
  return useQuery<User>({
    queryKey: id ? QK.user(id) : ["_disabled", "user"],
    queryFn: () => apiGetUser(String(id)),
    enabled: !!id,
  });
}

/** Cập nhật thông tin user */
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

/** Đổi mật khẩu user */
export function useChangePassword(userId: string | number) {
  return useMutation({
    mutationFn: (payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => apiChangePassword(String(userId), payload),
  });
}
