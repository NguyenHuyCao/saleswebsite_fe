"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as AuthApi from "./api";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ChangePasswordInput,
  UserAccount,
} from "./types";
import { QK } from "@/lib/api/cacheKeys";

// Me
export function useMeQuery() {
  return useQuery<UserAccount, Error>({
    queryKey: QK.me,
    queryFn: AuthApi.fetchMe,
  });
}
export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UserAccount>) => AuthApi.updateMe(payload),
    onSuccess: (data) => {
      qc.setQueryData(QK.me, data);
      if (typeof window !== "undefined")
        localStorage.setItem("user", JSON.stringify(data));
    },
  });
}
export function useChangePasswordMe() {
  return useMutation({
    mutationFn: (payload: ChangePasswordInput) =>
      AuthApi.changePasswordMe(payload),
  });
}

// Auth
export function useLogin() {
  const qc = useQueryClient();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: AuthApi.login,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}
export function useRegister() {
  return useMutation<any, Error, RegisterPayload>({
    mutationFn: AuthApi.registerUser,
  });
}
