// product-detail/api.ts
"use server";

import { cookies } from "next/headers";
// import type { Product, Category } from "@/product/types";

export async function getProductDetailBySlug(slug: string): Promise<{
  product: Product | null;
  category: Category | null;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 1) product
  const productRes = await fetch(
    `${process.env.BACKEND_URL}/api/v1/products/${slug}`,
    { headers, cache: "no-store" }
  );
  const productData = await productRes.json();
  const p = productData?.data;
  if (!p) return { product: null, category: null };

  // Chuẩn hoá theo Product (đồng bộ list page)
  const currentPrice = p.pricePerUnit ?? p.price ?? 0;
  const originalPrice = p.price ?? currentPrice;

  const product: Product = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    imageAvt: p.imageAvt,
    imageDetail1: p.imageDetail1 || "",
    imageDetail2: p.imageDetail2 || "",
    imageDetail3: p.imageDetail3 || "",
    description: p.description || "",
    price: currentPrice,
    pricePerUnit: currentPrice,
    originalPrice,
    sale: currentPrice < originalPrice,
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
  };

  // 2) category theo id của product
  let category: Category | null = null;
  if (p.categoryId) {
    const categoryRes = await fetch(
      `${process.env.BACKEND_URL}/api/v1/categories/${p.categoryId}`,
      { headers, cache: "no-store" }
    );
    const categoryData = await categoryRes.json();
    const c = categoryData?.data;

    if (c) {
      const now = new Date();
      category = {
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image || c.imageAvt,
        products: (c.products || []).map((item: any): Product => {
          const createdAt = new Date(item.createdAt);
          const isNew =
            (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
          const cp = item.pricePerUnit ?? item.price ?? 0;
          const op = item.price ?? cp;

          return {
            id: item.id,
            name: item.name,
            slug: item.slug,
            imageAvt: item.imageAvt,
            imageDetail1: item.imageDetail1 || "",
            imageDetail2: item.imageDetail2 || "",
            imageDetail3: item.imageDetail3 || "",
            description: item.description || "",
            price: cp,
            pricePerUnit: cp,
            originalPrice: op,
            sale: cp < op,
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
      };
    }
  }

  return { product, category };
}
