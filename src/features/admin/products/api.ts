// src/features/admin/products/api.ts
import type { ApiResp, Paged, Product, SimpleOption } from "./types";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ======= Products =======
export async function apiListProducts(): Promise<Paged<Product>> {
  const res = await fetch(`${BASE}/api/v1/products?page=1&size=1000`, {
    headers: { ...authHeaders() },
  });
  const json: ApiResp<Paged<Product>> = await res.json();
  if (!res.ok) throw new Error(json.message || "Fetch products failed");
  return json.data;
}

export async function apiGetProduct(slug: string): Promise<Product> {
  const res = await fetch(`${BASE}/api/v1/products/${slug}`, {
    headers: { ...authHeaders() },
  });
  const json: ApiResp<Product> = await res.json();
  if (!res.ok) throw new Error(json.message || "Fetch product failed");
  return json.data;
}

export async function apiToggleActive(slug: string): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/products/${slug}/toggle-active`, {
    method: "PUT",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.message || "Toggle active failed");
  }
}

// ======= Catalog options =======
export async function apiCategories(): Promise<SimpleOption[]> {
  const res = await fetch(`${BASE}/api/v1/categories`, {
    headers: { ...authHeaders() },
  });
  const json: ApiResp<Paged<SimpleOption>> = await res.json();
  if (!res.ok) throw new Error(json.message || "Fetch categories failed");
  return json.data.result;
}

export async function apiBrands(): Promise<SimpleOption[]> {
  const res = await fetch(`${BASE}/api/v1/brands`, {
    headers: { ...authHeaders() },
  });
  const json: ApiResp<Paged<SimpleOption>> = await res.json();
  if (!res.ok) throw new Error(json.message || "Fetch brands failed");
  return json.data.result;
}

// ======= Create (Step 1..4) =======
export async function apiCreateStep1(payload: {
  name: string;
  description: string;
  origin: string;
  category: { id: number | null };
  brand: { id: number | null };
}): Promise<{ slug: string }> {
  const res = await fetch(`${BASE}/api/v1/products/step1`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const json: ApiResp<{ slug: string }> = await res.json();
  if (res.status !== 201)
    throw new Error(
      Array.isArray(json.message) ? json.message.join("\n") : json.message
    );
  return json.data;
}

export async function apiCreateStep2(
  slug: string,
  payload: {
    power: string;
    fuelType: string;
    engineType: string;
    weight: number;
    dimensions: string;
    tankCapacity: number;
  }
): Promise<{ slug: string }> {
  const res = await fetch(`${BASE}/api/v1/products/step2/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const json: ApiResp<{ slug: string }> = await res.json();
  if (res.status !== 201)
    throw new Error(
      Array.isArray(json.message) ? json.message.join("\n") : json.message
    );
  return json.data;
}

export async function apiCreateStep3(
  slug: string,
  payload: {
    price: number;
    costPrice: number;
    stockQuantity: number;
    warrantyMonths: number;
  }
): Promise<{ slug: string }> {
  const res = await fetch(`${BASE}/api/v1/products/step3/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const json: ApiResp<{ slug: string }> = await res.json();
  if (res.status !== 201) throw new Error(json.message || "Step 3 failed");
  return json.data;
}

export async function apiCreateStep4(
  slug: string,
  files: {
    imageAvt?: File | null;
    imageDetail1?: File | null;
    imageDetail2?: File | null;
    imageDetail3?: File | null;
  }
): Promise<void> {
  const fd = new FormData();
  if (files.imageAvt) fd.append("imageAvt", files.imageAvt);
  [files.imageDetail1, files.imageDetail2, files.imageDetail3].forEach(
    (f) => f && fd.append("imageDetails", f)
  );
  const res = await fetch(`${BASE}/api/v1/products/step4/${slug}`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: fd,
  });
  if (res.status !== 201) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.message || "Upload images failed");
  }
}

// ======= Update (Step 1..4) =======
export async function apiUpdateStep1(
  id: number,
  payload: {
    name: string;
    description: string;
    origin: string;
    category: { id: number | null };
    brand: { id: number | null };
  }
): Promise<{ slug: string }> {
  const res = await fetch(`${BASE}/api/v1/products/step1/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const json: ApiResp<{ slug: string }> = await res.json();
  if (!res.ok)
    throw new Error(
      Array.isArray(json.message) ? json.message.join("\n") : json.message
    );
  return json.data;
}

export async function apiUpdateStep2(
  slug: string,
  payload: {
    power: string;
    fuelType: string;
    engineType: string;
    weight: number;
    dimensions: string;
    tankCapacity: number;
  }
): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/products/step2/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.message || "Update step 2 failed");
  }
}

export async function apiUpdateStep3(
  slug: string,
  payload: {
    price: number;
    costPrice: number;
    stockQuantity: number;
    warrantyMonths: number;
  }
): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/products/step3/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.message || "Update step 3 failed");
  }
}

export async function apiUpdateStep4(
  slug: string,
  files: {
    imageAvt?: File | null;
    imageDetail1?: File | null;
    imageDetail2?: File | null;
    imageDetail3?: File | null;
  }
): Promise<void> {
  const fd = new FormData();
  if (files.imageAvt instanceof File) fd.append("imageAvt", files.imageAvt);
  [files.imageDetail1, files.imageDetail2, files.imageDetail3].forEach(
    (f) => f instanceof File && fd.append("imageDetails", f)
  );
  const res = await fetch(`${BASE}/api/v1/products/step4/${slug}`, {
    method: "PUT",
    headers: { ...authHeaders() },
    body: fd,
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.message || "Update images failed");
  }
}
