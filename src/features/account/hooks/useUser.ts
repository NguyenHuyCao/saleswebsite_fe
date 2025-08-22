"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  getUserById,
  updateUser,
} from "../services/users.service";
import type { UserInfoInput } from "../schemas/user.schema";
import type { PasswordInput } from "../schemas/password.schema";

export const userKeys = {
  detail: (id: string) => ["user", id] as const,
};

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

export const useChangePassword = (id: string) =>
  useMutation({
    mutationFn: (payload: PasswordInput) => changePassword(id, payload),
  });
