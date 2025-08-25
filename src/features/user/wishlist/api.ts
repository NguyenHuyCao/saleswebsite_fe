const BASE = process.env.NEXT_PUBLIC_BACKEND_URL as string;

const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchWishlistApi() {
  const res = await fetch(`${BASE}/api/v1/wish_list`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Không tải được danh sách yêu thích");
  const data = await res.json();
  return (data?.data?.result ?? data?.data ?? []) as any[];
}

/** server đang toggle bằng POST form-data: productId */
export async function toggleWishlist(productId: number) {
  const form = new FormData();
  form.append("productId", String(productId));
  const res = await fetch(`${BASE}/api/v1/wish_list`, {
    method: "POST",
    headers: { ...authHeaders() }, // KHÔNG set Content-Type khi gửi FormData
    body: form,
  });
  if (!res.ok) throw new Error("Cập nhật yêu thích thất bại");
}
