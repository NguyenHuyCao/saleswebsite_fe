const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getBrands(params?: { page?: number; size?: number }) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 1000;
  const res = await fetch(`${BASE}/api/v1/brands?page=${page}&size=${size}`, {
    headers: { ...authHeaders() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Không thể tải danh sách thương hiệu");
  const json = await res.json();
  return json.data as { result: any[]; meta: any };
}

export async function createBrand(payload: FormData) {
  const res = await fetch(`${BASE}/api/v1/brands`, {
    method: "POST",
    headers: { ...authHeaders() }, // KHÔNG set Content-Type cho FormData
    body: payload,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Thêm thương hiệu thất bại");
  return json.data;
}

export async function updateBrand(id: number, payload: FormData) {
  const res = await fetch(`${BASE}/api/v1/brands/${id}`, {
    method: "PUT",
    headers: { ...authHeaders() },
    body: payload,
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.message || "Cập nhật thương hiệu thất bại");
  return json.data;
}
