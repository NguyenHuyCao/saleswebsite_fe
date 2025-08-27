import { api } from "@/lib/api/http";
import type {
  Product,
  Category,
  CategoryWithProducts,
  Promotion,
} from "./types";

const P_NEW = "/api/v1/products?sort=createdAt,desc";
const P_PROMOS = "/api/v1/promotions";
const P_VOUCHERS = "/api/v1/promotions/requires-products";
const P_BRANDS = "/api/v1/brands";
const P_CATS = "/api/v1/categories";

// ----- mappers
const toProduct = (item: any): Product => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  imageAvt: item.imageAvt,
  imageDetail1: item.imageDetail1 ?? "",
  imageDetail2: item.imageDetail2 ?? "",
  imageDetail3: item.imageDetail3 ?? "",
  description: item.description,
  price: item.pricePerUnit ?? item.price,
  pricePerUnit: item.pricePerUnit ?? item.price,
  originalPrice: item.price,
  sale: item.price !== item.pricePerUnit,
  inStock: item.active === true,
  label: item.active ? "Thêm vào giỏ" : "Hết hàng",
  stockQuantity: item.stockQuantity,
  totalStock: item.totalStock,
  power: item.power ?? "",
  fuelType: item.fuelType ?? "",
  engineType: item.engineType ?? "",
  weight: item.weight ?? 0,
  dimensions: item.dimensions ?? "",
  tankCapacity: item.tankCapacity ?? 0,
  origin: item.origin ?? "",
  warrantyMonths: item.warrantyMonths ?? 0,
  createdAt: item.createdAt,
  createdBy: item.createdBy ?? "",
  updatedAt: item.updatedAt ?? null,
  updatedBy: item.updatedBy ?? "",
  rating: item.rating ?? 0,
  favorite: item.wishListUser === true,
});

export async function fetchNewProducts(): Promise<Product[]> {
  const raw = await api.get<any>(P_NEW);
  const arr = Array.isArray(raw?.result) ? raw.result : raw;
  const now = new Date().getTime();
  return (arr || []).map((it: any) => {
    const p = toProduct(it);
    const isNew =
      (now - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 30;
    return {
      ...p,
      status: p.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
    };
  });
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
  const now = new Date().getTime();

  return (arr || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    products: (c.products || []).slice(0, 5).map((it: any) => {
      const p = toProduct(it);
      const isNew =
        (now - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 30;
      return {
        ...p,
        status: p.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
      };
    }),
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
