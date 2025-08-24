import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import CartView from "@/features/cart/CartView";

export default function CartPage() {
  return (
    <>
      <PageViewTracker />
      <CartView />
    </>
  );
}
