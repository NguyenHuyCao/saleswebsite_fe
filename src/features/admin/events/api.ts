const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeader = () => ({
  Authorization: `Bearer ${
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""
  }`,
});

export async function fetchPromotions() {
  const res = await fetch(`${BASE}/api/v1/promotions`, {
    headers: authHeader(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Không tải được khuyến mãi");
  return json.data as any[]; // Promotion[]
}

export async function fetchPromotionById(id: string | number) {
  const res = await fetch(`${BASE}/api/v1/promotions/id?promotionId=${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Không tải được chi tiết KM");
  return json.data; // Promotion
}

export async function fetchPromotionProducts(id: number) {
  const res = await fetch(`${BASE}/api/v1/promotions/${id}`, {
    headers: authHeader(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Không tải được SP áp dụng");
  return json.data as any[]; // Product[]
}

export async function deleteProductFromPromotion(
  promotionId: number,
  productId: number
) {
  const res = await fetch(
    `${BASE}/api/v1/promotions/delete-product/${promotionId}?productId=${productId}`,
    { method: "DELETE", headers: authHeader() }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Xóa sản phẩm thất bại");
  return json;
}

export async function upsertPromotion(
  method: "POST" | "PUT",
  payload: any,
  id?: string | number
) {
  const url =
    method === "PUT"
      ? `${BASE}/api/v1/promotions/${id}`
      : `${BASE}/api/v1/promotions`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Gửi dữ liệu thất bại");
  return json;
}

export async function fetchBrandsWithProducts() {
  const res = await fetch(`${BASE}/api/v1/brands`, { headers: authHeader() });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Không tải được thương hiệu");
  return (json.data?.result ?? []) as any[]; // Brand[]
}
