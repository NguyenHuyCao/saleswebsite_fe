import { api } from "@/lib/api/http";
import { mapProduct } from "@/lib/utils/productMapper";
import type { Category, CategoryWithProducts, Promotion } from "./types";

const P_NEW = "/api/v1/products?sort=createdAt,desc";
const P_PROMOS = "/api/v1/promotions";
const P_VOUCHERS = "/api/v1/promotions/type?requiresCode=true&activeOnly=true";
const P_BRANDS = "/api/v1/brands";
const P_CATS = "/api/v1/categories";

export async function fetchNewProducts(): Promise<Product[]> {
  const raw = await api.get<any>(P_NEW);
  const arr = Array.isArray(raw?.result) ? raw.result : raw;
  const nowMs = Date.now();
  return (arr || []).map((it: any) => mapProduct(it, nowMs));
}

export async function fetchBrands(): Promise<string[]> {
  const raw = await api.get<any>(P_BRANDS);
  const arr = Array.isArray(raw?.result) ? raw.result : raw;
  return (arr || []).map((b: any) => b.logo).filter(Boolean);
}

export async function fetchCategories(): Promise<Category[]> {
  const raw = await api.get<any>(P_CATS);
  const arr = Array.isArray(raw?.result) ? raw.result : raw;
  return (arr || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    slug: c.slug,
    title: c.name,
  }));
}

export async function fetchCategoriesWithProducts(): Promise<
  CategoryWithProducts[]
> {
  const raw = await api.get<any>(P_CATS);
  const arr = Array.isArray(raw?.result) ? raw.result : raw;
  const nowMs = Date.now();

  return (arr || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? "",
    products: (c.products || []).slice(0, 5).map((it: any) => mapProduct(it, nowMs)),
  }));
}

export async function fetchPromotions(): Promise<Promotion[]> {
  const data = await api.get<any[]>(P_PROMOS);
  return (data || []) as Promotion[];
}

export async function fetchVouchers(): Promise<Promotion[]> {
  const data = await api.get<any[]>(P_VOUCHERS);
  return (data || []) as Promotion[];
}
