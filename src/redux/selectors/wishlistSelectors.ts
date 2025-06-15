import { AppState } from "../store";

export const selectWishlistItems = (state: AppState) => state.wishlist.result;

export const selectIsProductInWishlist =
  (productId: number) => (state: AppState) =>
    state.wishlist.result.some((item) => item.id === productId);

export const selectWishlistMeta = (state: AppState) => state.wishlist.meta;
