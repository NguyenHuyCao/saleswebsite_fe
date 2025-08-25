"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  changePasswordMe,
  getUserById,
  updateUser,
} from "../services/users.service";
import { fetchMe, updateMe } from "../services/users.service";
import type { UserInfoInput } from "../schemas/user.schema";
import type { PasswordInput } from "../schemas/password.schema";
import type { UserAccount } from "../types";
import { QK } from "@/lib/api/cacheKeys";

export function useMeQuery() {
  return useQuery<UserAccount, Error>({ queryKey: QK.me, queryFn: fetchMe });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      qc.setQueryData(QK.me, data);
      if (typeof window !== "undefined")
        localStorage.setItem("user", JSON.stringify(data));
    },
  });
}

export const userKeys = { detail: (id: string) => ["user", id] as const };

export const useUser = (id?: string | null) =>
  useQuery({
    queryKey: userKeys.detail(id || ""),
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });

export const useUpdateUser = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserInfoInput) => updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.detail(id) }),
  });
};

/** Admin/setting theo id */
export const useChangePassword = (id: string) =>
  useMutation({
    mutationFn: (payload: PasswordInput) => changePassword(id, payload),
  });

/** Flow “me” cho trang /change-password */
export const useChangePasswordMe = () =>
  useMutation({
    mutationFn: (payload: PasswordInput) => changePasswordMe(payload),
  });
