// wishlist/queries.ts
"use client";

import useSWR, { mutate } from "swr";
import type { Product } from "@/features/user/products/types";
import { fetchWishlistApi } from "./api";

export const WISHLIST_QUERY_KEY = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`;

const normalizeToProduct = (items: any[]): Product[] => {
  const now = new Date().getTime();
  return items.map((item: any): Product => {
    const createdAtMs = item?.createdAt
      ? new Date(item.createdAt).getTime()
      : now;
    const isNew = (now - createdAtMs) / (1000 * 60 * 60 * 24) <= 30;
    const isHot = (item.totalStock ?? 0) - (item.stockQuantity ?? 0) > 10;

    const price = item.pricePerUnit ?? item.price ?? 0;
    const originalPrice = item.price ?? price;

    const tags: string[] = [];
    if (isNew) tags.push("Mới");
    if (isHot) tags.push("Bán chạy");

    const inStock = (item.stockQuantity ?? 0) > 0;

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      imageAvt: item.imageAvt,
      imageDetail1: item.imageDetail1 ?? "",
      imageDetail2: item.imageDetail2 ?? "",
      imageDetail3: item.imageDetail3 ?? "",
      description: item.description ?? "",
      price,
      pricePerUnit: price,
      originalPrice,
      sale: price < originalPrice,
      inStock,
      label: inStock ? "Thêm vào giỏ" : "Hết hàng",
      stockQuantity: item.stockQuantity ?? 0,
      totalStock: item.totalStock ?? 0,
      power: item.power ?? "N/A",
      fuelType: item.fuelType ?? "N/A",
      engineType: item.engineType ?? "N/A",
      weight: item.weight ?? 0,
      dimensions: item.dimensions ?? "",
      tankCapacity: item.tankCapacity ?? 0,
      origin: item.origin ?? "Không rõ",
      warrantyMonths: item.warrantyMonths ?? 0,
      createdAt: item.createdAt ?? new Date().toISOString(),
      createdBy: item.createdBy ?? "",
      updatedAt: item.updatedAt ?? null,
      updatedBy: item.updatedBy ?? "",
      rating: item.rating ?? 0,
      status: tags,
      favorite: true,
    };
  });
};

export const useWishlist = () => {
  return useSWR<Product[]>(WISHLIST_QUERY_KEY, async () => {
    const raw = await fetchWishlistApi();
    return normalizeToProduct(raw);
  });
};

export const bounceWishlistCounters = () => {
  mutate(WISHLIST_QUERY_KEY);
};
