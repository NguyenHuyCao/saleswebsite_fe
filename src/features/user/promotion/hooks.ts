// promotion/hooks.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { getPromotions } from "./api";
import { PROMOTIONS_KEY } from "./queries";

export function usePromotions() {
  return useQuery({
    queryKey: PROMOTIONS_KEY,
    queryFn: getPromotions,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
