"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchNewProducts,
  fetchBrands,
  fetchCategoriesWithProducts,
  fetchPromotions,
  fetchVouchers,
} from "./api";
import type { Product, CategoryWithProducts, Promotion } from "./types";

export const QK = {
  newProducts: ["home", "newProducts"] as const,
  brands: ["home", "brands"] as const,
  catWithProducts: ["home", "catWithProducts"] as const,
  promotions: ["home", "promotions"] as const,
  vouchers: ["home", "vouchers"] as const,
};

const common = { retry: 2, refetchOnWindowFocus: false } as const;

export function useNewProducts() {
  return useQuery<Product[]>({
    queryKey: QK.newProducts,
    queryFn: fetchNewProducts,
    staleTime: 60_000,
    ...common,
  });
}

export function useBrands() {
  return useQuery<string[]>({
    queryKey: QK.brands,
    queryFn: fetchBrands,
    staleTime: 3_600_000, // 1h
    ...common,
  });
}

export function useCategoriesWithProducts() {
  return useQuery<CategoryWithProducts[]>({
    queryKey: QK.catWithProducts,
    queryFn: fetchCategoriesWithProducts,
    staleTime: 300_000, // 5m
    ...common,
  });
}

export function usePromotions() {
  return useQuery<Promotion[]>({
    queryKey: QK.promotions,
    queryFn: fetchPromotions,
    staleTime: 300_000,
    ...common,
  });
}

export function useVouchers() {
  return useQuery<Promotion[]>({
    queryKey: QK.vouchers,
    queryFn: fetchVouchers,
    staleTime: 300_000,
    ...common,
  });
}
