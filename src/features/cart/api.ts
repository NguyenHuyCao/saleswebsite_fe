import { http } from "@/lib/api/http";
import type {
  CartItem,
  PlaceOrderPayload,
  VoucherValidateResponse,
} from "./types";

// Helper: header Authorization từ localStorage
const authHeader = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getCart(): Promise<CartItem[]> {
  const res = await http.get("/api/v1/carts", { headers: authHeader() });
  // BE trả { data: CartItem[] }
  return res.data?.data ?? [];
}

export async function updateCartItemQuantity(
  productId: number,
  quantity: number
) {
  await http.put(
    "/api/v1/carts",
    { productId, quantity },
    { headers: { ...authHeader(), "Content-Type": "application/json" } }
  );
}

export async function deleteCartItem(productId: number) {
  await http.delete(`/api/v1/carts`, {
    params: { productId },
    headers: authHeader(),
  });
}

export async function clearUserCart() {
  await http.delete(`/api/v1/carts/user`, { headers: authHeader() });
}

export async function validateVoucher(
  code: string
): Promise<VoucherValidateResponse> {
  const res = await http.get("/api/v1/promotions/validate", {
    params: { code },
    headers: { "Content-Type": "application/json" },
  });
  return res.data?.data as VoucherValidateResponse;
}

export async function getUserAddressById(userId: number): Promise<string> {
  const res = await http.get(`/api/v1/users/${userId}`, {
    headers: authHeader(),
  });
  return res.data?.data?.address ?? "";
}

export async function placeOrder(payload: PlaceOrderPayload) {
  const res = await http.post("/api/v1/orders", payload, {
    headers: { ...authHeader(), "Content-Type": "application/json" },
  });
  return res.data?.data as { orderId: number; paymentUrl?: string };
}
