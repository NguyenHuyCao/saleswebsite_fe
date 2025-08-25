"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { QK } from "@/lib/api/cacheKeys";
import type { LoginPayload, LoginResponse } from "../type";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}
