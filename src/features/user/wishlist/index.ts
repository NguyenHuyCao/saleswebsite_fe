// wishlist/index.ts
// Components
export { default as EmptyState } from "./components/EmptyState";
export { default as WishlistGrid } from "./components/WishlistGrid";
export { default as WishlistHeroSection } from "./components/WishlistHeroSection";
export { default as WishlistShareModal } from "./components/WishlistShareModal";
export { default as WishlistStats } from "./components/WishlistStats";
export { default as WishlistToolbar } from "./components/WishlistToolbar";

// Contexts
export { SnackbarProvider } from "./contexts/SnackbarContext";

// Hooks
export { useWishlistBulk } from "./hooks/useWishlistBulk";
// export { useSnackbar } from "./hooks/useSnackbar";

// Queries & API
export {
  useWishlist,
  WISHLIST_QUERY_KEY,
  bounceWishlistCounters,
} from "./queries";
export { fetchWishlistApi, toggleWishlist, removeFromWishlist } from "./api";

// Types
export type { WishlistRaw, WishlistResponse } from "./types";

// Main View
export { default as WishlistView } from "./WishlistView";
