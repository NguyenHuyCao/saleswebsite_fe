"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as AuthApi from "./api";
import type {
  ChangePasswordInput,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ProfileCompletePayload,
  RegisterPayload,
  ResetPasswordPayload,
  UserAccount,
} from "./types";
import { QK } from "@/lib/api/cacheKeys";

// ── Profile ───────────────────────────────────────────────────────────────

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

export function useCompleteProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileCompletePayload) => AuthApi.completeProfile(payload),
    onSuccess: (data) => {
      qc.setQueryData(QK.me, data);
      if (typeof window !== "undefined")
        localStorage.setItem("user", JSON.stringify(data));
    },
  });
}

export function useChangePasswordMe() {
  return useMutation({
    mutationFn: (payload: ChangePasswordInput) => AuthApi.changePasswordMe(payload),
  });
}

// ── Auth ──────────────────────────────────────────────────────────────────

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
  return useMutation<void, Error, RegisterPayload>({
    mutationFn: AuthApi.registerUser,
  });
}

// ── Email verification ────────────────────────────────────────────────────

export function useVerifyEmail() {
  return useMutation<{ message: string }, Error, string>({
    mutationFn: AuthApi.verifyEmail,
  });
}

export function useResendVerification() {
  return useMutation<void, Error, void>({
    mutationFn: () => AuthApi.resendVerification(),
  });
}

// ── Forgot / Reset password ───────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation<void, Error, ForgotPasswordPayload>({
    mutationFn: AuthApi.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordPayload>({
    mutationFn: AuthApi.resetPassword,
  });
}
