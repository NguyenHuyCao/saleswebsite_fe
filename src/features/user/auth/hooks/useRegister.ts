"use client";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth.service";
import type { RegisterPayload } from "../type";

export function useRegister() {
  return useMutation<void, Error, RegisterPayload>({
    mutationFn: registerUser,
  });
}
