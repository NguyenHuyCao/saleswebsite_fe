// src/lib/api/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount: number, error: unknown): boolean => {
        // Không retry nếu 401
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return false;
        }
        // Retry tối đa 2 lần
        return failureCount < 2;
      },
      staleTime: 60_000,
    },
    mutations: { retry: false }, // hoặc 0
  },
});
