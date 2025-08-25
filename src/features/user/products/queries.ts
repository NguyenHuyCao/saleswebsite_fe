// product/queries.ts
// Khoá dùng cho mutate/revalidate hoặc react-query nếu cần
export const PRODUCT_LIST_KEY = (qs: string) => ["products", qs] as const;
export const CATEGORY_WITH_PRODUCTS_KEY = ["categories-with-products"] as const;
export const BRANDS_KEY = ["brands"] as const;
