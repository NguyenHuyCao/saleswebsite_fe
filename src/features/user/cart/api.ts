import { api } from "@/lib/api/http";
import type {
  CartItem,
  PlaceOrderPayload,
  VoucherValidateResponse,
} from "./types";

/** Tất cả dùng api.<method> đã unwrap -> trả thẳng T, không tự gắn headers nữa */

export async function getCart(): Promise<CartItem[]> {
  return api.get<CartItem[]>("/api/v1/carts");
}

export async function updateCartItemQuantity(
  productId: number,
  quantity: number,
  variantId?: number | null
) {
  await api.put<void, { productId: number; quantity: number; variantId?: number | null }>(
    "/api/v1/carts",
    { productId, quantity, variantId: variantId ?? undefined }
  );
}

export async function deleteCartItem(productId: number, variantId?: number | null) {
  await api.delete<void>("/api/v1/carts", {
    params: { productId, ...(variantId != null ? { variantId } : {}) },
  });
}

export async function clearUserCart() {
  await api.delete<void>("/api/v1/carts/user");
}

export async function validateVoucher(
  code: string
): Promise<VoucherValidateResponse> {
  return api.get<VoucherValidateResponse>("/api/v1/promotions/validate", {
    params: { code },
  });
}

/** BE trả user object; ta trả về address (có thể rỗng) */
export async function getUserAddressById(userId: number): Promise<string> {
  const user = await api.get<any>(`/api/v1/users/${userId}`);
  return user?.address ?? "";
}

export async function placeOrder(payload: PlaceOrderPayload) {
  return api.post<{ orderId: number; paymentUrl?: string }, PlaceOrderPayload>(
    "/api/v1/orders",
    payload
  );
}
