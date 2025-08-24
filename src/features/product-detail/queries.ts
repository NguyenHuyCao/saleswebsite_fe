// product-detail/queries.ts
export const PRODUCT_DETAIL_KEY = (slug: string) =>
  ["product-detail", slug] as const;
export const PRODUCT_CATEGORY_KEY = (id: number | string) =>
  ["product-category", id] as const;
