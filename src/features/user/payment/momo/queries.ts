"use client";

import { useQuery } from "@tanstack/react-query";
import { getMomoConfig } from "./api";
import type { MomoConfig } from "./types";

export const momoKeys = {
  config: ["payments", "momo", "config"] as const,
};

export function useMomoConfigQuery() {
  return useQuery<MomoConfig, Error>({
    queryKey: momoKeys.config,
    queryFn: getMomoConfig,
  });
}
