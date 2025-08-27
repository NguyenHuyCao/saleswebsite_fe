import { api } from "@/lib/api/http";
import type {
  CartResponse,
  PlaceOrderPayload,
  PlaceOrderResult,
} from "./types";

/** Lấy giỏ hàng hiện tại */
export async function fetchCart(): Promise<CartResponse> {
  return api.get<CartResponse>("/api/v1/carts");
}

/** Tạo đơn hàng từ giỏ */
export async function placeOrder(
  payload: PlaceOrderPayload
): Promise<PlaceOrderResult> {
  // ⚠️ Nếu BE dùng endpoint khác (vd /carts/checkout) chỉ cần đổi path tại đây.
  return api.post<PlaceOrderResult, PlaceOrderPayload>(
    "/api/v1/orders",
    payload
  );
}
