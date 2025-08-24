import { queryOptions } from "@tanstack/react-query";
import { fetchBrands } from "./api";

export const brandKeys = {
  all: ["brands"] as const,
};

export const brandsOptions = () =>
  queryOptions({
    queryKey: brandKeys.all,
    queryFn: fetchBrands,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });
