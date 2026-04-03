// src/lib/utils/productMapper.ts
// Single source of truth for mapping raw API product items to the Product type.

import type { Product } from "@/features/user/products/types";

/**
 * Normalize a discount value that may be expressed as a fraction (0–1)
 * or as a percentage (1–100). Always returns a value in [0, 100].
 */
function normalizeDiscountPct(val: number): number {
  return val > 1 ? val : val * 100;
}

/**
 * Map a raw API product item to the typed Product shape.
 *
 * @param item        Raw API response object
 * @param nowMs       Current timestamp (ms) — used to detect "new" products (≤30 days old)
 * @param discountPct Optional promotion discount (0–1 fraction OR 0–100 percent).
 *                    When supplied, `sale`, `price`, `originalPrice`, and `discountPercent`
 *                    are computed from the base price; otherwise the product has no active discount.
 */
export function mapProduct(
  item: any,
  nowMs: number,
  discountPct?: number
): Product {
  const isNew =
    (nowMs - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 30;

  const basePrice: number = item.price ?? 0;

  let price = basePrice;
  let originalPrice = basePrice;
  let sale = false;
  let discountPercent: number | undefined;

  if (discountPct !== undefined && discountPct > 0) {
    const pct = normalizeDiscountPct(discountPct); // normalised to 0-100
    discountPercent = Math.round(pct);
    price = Math.round(basePrice * (1 - pct / 100));
    originalPrice = basePrice;
    sale = price < originalPrice;
  }

  const stockQuantity: number = item.stockQuantity ?? 0;
  const inStock = item.active === true && stockQuantity > 0;

  // Status tags: only one meaningful tag per product
  const status: string[] =
    stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [];

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    imageAvt: item.imageAvt,
    imageDetail1: item.imageDetail1 || "",
    imageDetail2: item.imageDetail2 || "",
    imageDetail3: item.imageDetail3 || "",
    description: item.description || "",
    price,
    pricePerUnit: price,
    originalPrice,
    sale,
    discountPercent,
    inStock,
    label: inStock ? "Thêm vào giỏ" : "Hết hàng",
    stockQuantity,
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
    status,
    favorite: item.wishListUser === true,
    productType: item.productType,
    material: item.material || "",
    variants: item.variants || [],
  };
}
