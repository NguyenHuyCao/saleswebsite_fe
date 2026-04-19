import { api } from "@/lib/api/http";
import { mapProduct } from "@/lib/utils/productMapper";
import type { Category, CategoryWithProducts, Promotion, BrandItem } from "./types";
import type { Product } from "@/features/user/products/types";

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

export async function fetchBrands(): Promise<BrandItem[]> {
  const raw = await api.get<any>(P_BRANDS);
  const arr = Array.isArray(raw?.result) ? raw.result : Array.isArray(raw) ? raw : [];
  return (arr || [])
    .filter((b: any) => b.logo)
    .map((b: any) => ({
      id: String(b.id ?? b.slug ?? Math.random()),
      name: b.name || b.brandName || "",
      logo: b.logo,
      slug: b.slug || String(b.id ?? ""),
    }));
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

export async function fetchBestSellers(): Promise<Product[]> {
  const raw = await api.get<any>("/api/v1/products?sort=rating,desc&size=10&active=true");
  const arr = Array.isArray(raw?.result) ? raw.result : Array.isArray(raw) ? raw : [];
  const nowMs = Date.now();
  return arr.map((it: any) => mapProduct(it, nowMs));
}

export type SiteStats = {
  productCount: number;
  brandCount: number;
  categoryCount: number;
  customerCount: number;
  reviewCount: number;
  avgRating: number;
  satisfactionRate: number;  // % review 4-5 sao, fallback 98 khi chưa đủ data
  yearsOfExperience: number;
};

export async function fetchSiteStats(): Promise<SiteStats> {
  try {
    const raw = await api.get<any>("/api/v1/site-stats");
    const d = raw?.result ?? raw;
    if (d && typeof d.productCount === "number") {
      return {
        productCount: d.productCount,
        brandCount: d.brandCount,
        categoryCount: 0,
        customerCount: d.customerCount,
        reviewCount: d.reviewCount,
        avgRating: d.avgRating,
        satisfactionRate: d.satisfactionRate,
        yearsOfExperience: d.yearsOfExperience,
      };
    }
  } catch {
    // fallback bên dưới
  }

  // Fallback: gọi 3 endpoint cũ nếu /site-stats chưa sẵn sàng
  const [prods, brands, cats] = await Promise.allSettled([
    api.get<any>("/api/v1/products?size=1&sort=createdAt,desc"),
    api.get<any>("/api/v1/brands"),
    api.get<any>("/api/v1/categories"),
  ]);
  const productCount =
    prods.status === "fulfilled"
      ? (prods.value?.totalElements ?? prods.value?.result?.totalElements ?? 0)
      : 0;
  const brandCount =
    brands.status === "fulfilled"
      ? (Array.isArray(brands.value?.result) ? brands.value.result.length : (Array.isArray(brands.value) ? brands.value.length : 0))
      : 0;
  const categoryCount =
    cats.status === "fulfilled"
      ? (Array.isArray(cats.value?.result) ? cats.value.result.length : (Array.isArray(cats.value) ? cats.value.length : 0))
      : 0;

  return {
    productCount,
    brandCount,
    categoryCount,
    customerCount: 5000,
    reviewCount: 0,
    avgRating: 4.8,
    satisfactionRate: 98,
    yearsOfExperience: new Date().getFullYear() - 2019,
  };
}
