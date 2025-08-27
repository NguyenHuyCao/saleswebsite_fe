"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  changePasswordMe,
  getUserById,
  updateUser,
} from "../services";
import type { UserInfoInput } from "../schemas/user.schema";
import type { PasswordInput } from "../schemas/password.schema";

export const userKeys = {
  detail: (id: string) => ["user", id] as const,
};

export function useUser(id?: string | null) {
  return useQuery({
    queryKey: userKeys.detail(id || ""),
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserInfoInput) => updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.detail(id) }),
  });
}

/** Đổi mật khẩu theo id (admin) */
export function useChangePassword(id: string) {
  return useMutation({
    mutationFn: (payload: PasswordInput) => changePassword(id, payload),
  });
}

/** Đổi mật khẩu cho “me” */
export function useChangePasswordMe() {
  return useMutation({
    mutationFn: (payload: PasswordInput) => changePasswordMe(payload),
  });
}
