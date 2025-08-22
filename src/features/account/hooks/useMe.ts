"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMe, updateMe } from "../services/users.service";
import { QK } from "@/lib/api/cacheKeys";
import type { UserAccount } from "../types/user";

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
