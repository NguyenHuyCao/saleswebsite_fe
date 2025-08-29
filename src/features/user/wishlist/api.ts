// dùng axios http wrapper + unwrap
import { api, toApiError } from "@/lib/api/http";
import { WishlistRaw } from "./types";

// BE chuẩn đang dùng /api/v1/wishlist cho cả GET+POST toggle
// (nếu BE của bạn là /api/v1/wishlist cho GET thì sửa lại 1 chỗ dưới đây)

export type WishlistResponse = {
  result: WishlistRaw[];
  meta?: { page: number; pageSize: number; pages: number; total: number };
};

/** GET wishlist */
export async function fetchWishlistApi(): Promise<WishlistRaw[]> {
  try {
    // Nếu BE trả { data: { result } } thì unwrap sẽ trả { result, meta }
    // Nếu BE trả thẳng mảng, unwrap sẽ trả mảng
    const data = await api.get<WishlistResponse | WishlistRaw[]>(
      "/api/v1/wishlist" // <— nếu BE của bạn là /api/v1/wishlist thì đổi tại đây
    );

    if (Array.isArray(data)) return data;
    if (Array.isArray((data as WishlistResponse).result))
      return (data as WishlistResponse).result;

    return [];
  } catch (e) {
    throw toApiError(e);
  }
}

/** Toggle bằng POST FormData: productId */
export async function toggleWishlist(productId: number): Promise<void> {
  try {
    const form = new FormData();
    form.append("productId", String(productId));

    // quan trọng: override Content-Type để axios gửi multipart/form-data
    await api.post<unknown, FormData>("/api/v1/wishlist", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (e) {
    throw toApiError(e);
  }
}
