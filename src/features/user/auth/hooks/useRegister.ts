// hooks/useRegister.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services";
import type { RegisterPayload } from "../services";

type RegisterResult = Awaited<ReturnType<typeof registerUser>>;

export function useRegister() {
  return useMutation<RegisterResult, Error, RegisterPayload>({
    mutationFn: (vars) => registerUser(vars),
  });
}
