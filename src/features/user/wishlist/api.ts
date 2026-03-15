// wishlist/api.ts
import { api, toApiError } from "@/lib/api/http";
import { WishlistRaw, WishlistResponse } from "./types";

export async function fetchWishlistApi(): Promise<WishlistRaw[]> {
  try {
    const data = await api.get<WishlistResponse | WishlistRaw[]>(
      "/api/v1/wishlist",
    );

    if (Array.isArray(data)) return data;
    if (Array.isArray((data as WishlistResponse)?.result))
      return (data as WishlistResponse).result;

    return [];
  } catch (e) {
    throw toApiError(e);
  }
}

export async function toggleWishlist(productId: number): Promise<void> {
  try {
    const form = new FormData();
    form.append("productId", String(productId));

    await api.post<unknown, FormData>("/api/v1/wishlist", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (e) {
    throw toApiError(e);
  }
}

export async function removeFromWishlist(productId: number): Promise<void> {
  try {
    await api.delete(`/api/v1/wishlist/${productId}`);
  } catch (e) {
    throw toApiError(e);
  }
}
