// promotion/queries.ts
export const PROMOTIONS_KEY = ["promotions"] as const;
export const PROMOTION_PRODUCTS_KEY = (id: number) =>
  ["promotion-products", id] as const;
