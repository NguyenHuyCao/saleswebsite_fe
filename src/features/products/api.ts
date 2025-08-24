// product/api.ts
"use server";

import { cookies } from "next/headers";
import type { Brand, CategoryWithProducts, Product } from "./types";

/** Server: lấy categories kèm products (chuẩn hoá giá & trạng thái) */
export async function getCategoriesWithProducts(): Promise<
  CategoryWithProducts[]
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/categories`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const raw = await res.json();
  const data = raw?.data?.result || [];
  const now = new Date();

  return data.map((category: any) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image || category.imageAvt,
    products: (category.products || [])
      .slice(0, 4)
      .map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;

        const currentPrice = item.pricePerUnit ?? item.price ?? 0;
        const originalPrice = item.price ?? currentPrice;

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          imageAvt: item.imageAvt,
          imageDetail1: item.imageDetail1 || "",
          imageDetail2: item.imageDetail2 || "",
          imageDetail3: item.imageDetail3 || "",
          description: item.description || "",
          price: currentPrice,
          pricePerUnit: currentPrice,
          originalPrice,
          sale: currentPrice < originalPrice,
          inStock: item.active === true && (item.stockQuantity ?? 0) > 0,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          stockQuantity: item.stockQuantity ?? 0,
          totalStock: item.totalStock ?? 0,
          power: item.power || "",
          fuelType: item.fuelType || "",
          engineType: item.engineType || "",
          weight: item.weight || 0,
          dimensions: item.dimensions || "",
          tankCapacity: item.tankCapacity ?? 0,
          origin: item.origin || "",
          warrantyMonths: item.warrantyMonths ?? 0,
          createdAt: item.createdAt,
          createdBy: item.createdBy || "",
          updatedAt: item.updatedAt || null,
          updatedBy: item.updatedBy || "",
          rating: item.rating ?? 0,
          status:
            (item.stockQuantity ?? 0) === 0
              ? ["Hết hàng"]
              : isNew
              ? ["Mới"]
              : [],
          favorite: item.wishListUser === true,
        };
      }),
  }));
}

/** Server: lấy brands */
export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/brands`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const raw = await res.json();
  return raw?.data?.result || [];
}
