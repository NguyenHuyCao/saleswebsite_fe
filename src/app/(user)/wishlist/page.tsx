import type { Metadata } from "next";
import WishlistView from "@/features/user/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Danh sách yêu thích | Máy 2 Thì",
  description: "Xem lại các sản phẩm máy 2 thì bạn đã lưu yêu thích.",
  robots: { index: false },
};

export default function WishListPage() {
  return <WishlistView />;
}
