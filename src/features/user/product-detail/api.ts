// src/features/user/product-detail/api.ts
"use server";

import { cookies } from "next/headers";
import { http, type ApiEnvelope } from "@/lib/api/http";

/** Lấy accessToken tạm trên SERVER bằng refresh-cookie (httpOnly). */
async function getAccessTokenFromRefresh(): Promise<string | null> {
  const ck = cookies(); // Next.js App Router cookies (sync)
  const all = (await ck).getAll();
  if (!all.length) return null;

  // "k1=v1; k2=v2"
  const cookieHeader = all.map((c) => `${c.name}=${c.value}`).join("; ");

  try {
    const res = await http.get<ApiEnvelope<{ accessToken: string }>>(
      "/api/v1/auth/refresh",
      {
        headers: { Cookie: cookieHeader },
        // withCredentials đã bật sẵn ở http
      }
    );
    const anyRes = res as any;
    const token =
      res?.data?.data?.accessToken ??
      anyRes?.data?.accessToken ??
      anyRes?.accessToken ??
      null;

    return token || null;
  } catch {
    // Refresh hỏng -> coi như user chưa đăng nhập, vẫn trả dữ liệu public
    return null;
  }
}

/** GET helper trên server – chấp nhận cả envelope hoặc raw. */
async function serverGet<T>(
  path: string,
  token?: string | null
): Promise<T | null> {
  try {
    const res = await http.get<ApiEnvelope<T>>(path, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const payload: any = res.data;
    // Hỗ trợ cả 2 dạng: { data: T } hoặc T
    return (payload?.data ?? payload) as T;
  } catch {
    return null;
  }
}

/* -------------------- MAPPERS (đồng bộ với list page) -------------------- */
const mapProduct = (p: any): Product => {
  const price = p?.pricePerUnit ?? p?.price ?? 0;
  const originalPrice = p?.price ?? price;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    imageAvt: p.imageAvt,
    imageDetail1: p.imageDetail1 || "",
    imageDetail2: p.imageDetail2 || "",
    imageDetail3: p.imageDetail3 || "",
    description: p.description || "",
    price,
    pricePerUnit: price,
    originalPrice,
    sale: price < originalPrice,
    inStock: p.active === true && (p.stockQuantity ?? 0) > 0,
    label: p.active ? "Thêm vào giỏ" : "Hết hàng",
    stockQuantity: p.stockQuantity ?? 0,
    totalStock: p.totalStock ?? 0,
    power: p.power || "",
    fuelType: p.fuelType || "",
    engineType: p.engineType || "",
    weight: p.weight || 0,
    dimensions: p.dimensions || "",
    tankCapacity: p.tankCapacity ?? 0,
    origin: p.origin || "",
    warrantyMonths: p.warrantyMonths ?? 0,
    createdAt: p.createdAt,
    createdBy: p.createdBy || "",
    updatedAt: p.updatedAt || null,
    updatedBy: p.updatedBy || "",
    rating: p.rating ?? 0,
    status: (p.stockQuantity ?? 0) === 0 ? ["Hết hàng"] : [],
    favorite: p.wishListUser === true,
    productType: p.productType,
    material: p.material || "",
    videoUrl: p.videoUrl || undefined,
    variants: (p.variants ?? []).map((v: any) => ({
      id: v.id,
      size: v.size ?? null,
      color: v.color ?? null,
      sku: v.sku ?? null,
      stockQuantity: v.stockQuantity ?? 0,
      priceOverride: v.priceOverride ?? null,
      active: v.active ?? true,
    })),
  };
};

const mapCategory = (c: any): Category => {
  const now = Date.now();

  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image || c.imageAvt,
    products: (c.products || []).map((it: any): Product => {
      const createdAtMs = new Date(it.createdAt).getTime();
      const isNew = (now - createdAtMs) / (1000 * 60 * 60 * 24) <= 30;

      const price = it.pricePerUnit ?? it.price ?? 0;
      const originalPrice = it.price ?? price;

      return {
        id: it.id,
        name: it.name,
        slug: it.slug,
        imageAvt: it.imageAvt,
        imageDetail1: it.imageDetail1 || "",
        imageDetail2: it.imageDetail2 || "",
        imageDetail3: it.imageDetail3 || "",
        description: it.description || "",
        price,
        pricePerUnit: price,
        originalPrice,
        sale: price < originalPrice,
        inStock: it.active === true && (it.stockQuantity ?? 0) > 0,
        label: it.active ? "Thêm vào giỏ" : "Hết hàng",
        stockQuantity: it.stockQuantity ?? 0,
        totalStock: it.totalStock ?? 0,
        power: it.power || "",
        fuelType: it.fuelType || "",
        engineType: it.engineType || "",
        weight: it.weight || 0,
        dimensions: it.dimensions || "",
        tankCapacity: it.tankCapacity ?? 0,
        origin: it.origin || "",
        warrantyMonths: it.warrantyMonths ?? 0,
        createdAt: it.createdAt,
        createdBy: it.createdBy || "",
        updatedAt: it.updatedAt || null,
        updatedBy: it.updatedBy || "",
        rating: it.rating ?? 0,
        status:
          (it.stockQuantity ?? 0) === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
        favorite: it.wishListUser === true,
      };
    }),
  };
};

/* -------------------- PUBLIC API -------------------- */
export async function getProductDetailBySlug(slug: string): Promise<{
  product: Product | null;
  category: Category | null;
}> {
  // accessToken không ở cookie -> phải dùng refresh-cookie để đổi access cho SSR (nếu có)
  const token = await getAccessTokenFromRefresh();

  // 1) Product theo slug
  const rawProduct = await serverGet<any>(
    `/api/v1/products/${encodeURIComponent(slug)}`,
    token
  );
  if (!rawProduct) return { product: null, category: null };

  const product = mapProduct(rawProduct);

  // 2) Category theo categoryId
  let category: Category | null = null;
  if (rawProduct.categoryId) {
    const rawCat = await serverGet<any>(
      `/api/v1/categories/${rawProduct.categoryId}`,
      token
    );
    if (rawCat) category = mapCategory(rawCat);
  }

  return { product, category };
}
