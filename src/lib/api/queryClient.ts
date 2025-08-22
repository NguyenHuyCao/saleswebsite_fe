// src/lib/api/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (fail, err: any) =>
        err?.message?.includes("401") ? 0 : Math.min(fail, 2),
      staleTime: 60_000,
    },
    mutations: { retry: 0 },
  },
});
