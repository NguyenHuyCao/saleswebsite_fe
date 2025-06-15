"use server";

import { cookies } from "next/headers";

export type Brand = {
  id: number;
  name: string;
  logo: string;
  originCountry: string;
};

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
    image: category.image,
    products: (category.products || [])
      .slice(0, 4)
      .map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          imageAvt: item.imageAvt,
          imageDetail1: item.imageDetail1 || "",
          imageDetail2: item.imageDetail2 || "",
          imageDetail3: item.imageDetail3 || "",
          description: item.description,
          price: item.pricePerUnit,
          pricePerUnit: item.pricePerUnit,
          originalPrice: item.price,
          sale: item.price !== item.pricePerUnit,
          inStock: item.active === true,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          stockQuantity: item.stockQuantity,
          totalStock: item.totalStock,
          power: item.power,
          fuelType: item.fuelType,
          engineType: item.engineType,
          weight: item.weight,
          dimensions: item.dimensions,
          tankCapacity: item.tankCapacity,
          origin: item.origin,
          warrantyMonths: item.warrantyMonths,
          createdAt: item.createdAt,
          createdBy: item.createdBy,
          updatedAt: item.updatedAt,
          updatedBy: item.updatedBy,
          rating: item.rating || 0,
          status:
            item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
          favorite: item.wishListUser || false,
        };
      }),
  }));
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/brands`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const raw = await res.json();
  return raw?.data?.result || [];
}
