// src/features/admin/products/api.ts
import { api, http } from "@/lib/api/http";
import type { ApiResp, Paged, Product, SimpleOption } from "./types";

// ======= Products =======

export async function apiListProducts(): Promise<Paged<Product>> {
  // BE trả envelope { data: { result, meta } } -> unwrap ra { result, meta }
  return api.get<Paged<Product>>("/api/v1/products", {
    params: { page: 1, size: 1000 },
  });
}

export async function apiGetProduct(slug: string): Promise<Product> {
  return api.get<Product>(`/api/v1/products/${slug}`);
}

export async function apiToggleActive(slug: string): Promise<void> {
  // endpoint này thường chỉ trả message/status, không có data -> dùng http thuần
  await http.put(`/api/v1/products/${slug}/toggle-active`);
}

// ======= Catalog options =======

export async function apiCategories(): Promise<SimpleOption[]> {
  const data = await api.get<{ result: SimpleOption[]; meta: any }>(
    "/api/v1/categories"
  );
  return data.result ?? [];
}

export async function apiBrands(): Promise<SimpleOption[]> {
  const data = await api.get<{ result: SimpleOption[]; meta: any }>(
    "/api/v1/brands"
  );
  return data.result ?? [];
}

// ======= Create (Step 1..4) =======

export async function apiCreateStep1(payload: {
  name: string;
  description: string;
  origin: string;
  category: { id: number | null };
  brand: { id: number | null };
}): Promise<{ slug: string }> {
  return api.post<{ slug: string }, typeof payload>(
    "/api/v1/products/step1",
    payload
  );
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
  return api.post<{ slug: string }, typeof payload>(
    `/api/v1/products/step2/${slug}`,
    payload
  );
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
  return api.post<{ slug: string }, typeof payload>(
    `/api/v1/products/step3/${slug}`,
    payload
  );
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
  // upload FormData -> không unwrap
  const fd = new FormData();
  if (files.imageAvt) fd.append("imageAvt", files.imageAvt);
  [files.imageDetail1, files.imageDetail2, files.imageDetail3].forEach(
    (f) => f && fd.append("imageDetails", f)
  );
  await http.post(`/api/v1/products/step4/${slug}`, fd, {
    headers: {
      /* KHÔNG đặt Content-Type cho FormData */
    },
  });
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
  return api.put<{ slug: string }, typeof payload>(
    `/api/v1/products/step1/${id}`,
    payload
  );
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
  await http.put(`/api/v1/products/step2/${slug}`, payload);
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
  await http.put(`/api/v1/products/step3/${slug}`, payload);
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
  await http.put(`/api/v1/products/step4/${slug}`, fd);
}
