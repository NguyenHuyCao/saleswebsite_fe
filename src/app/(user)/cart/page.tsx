import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import CartView from "@/features/user/cart/CartView";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ select?: string }>;
}) {
  const { select } = await searchParams;
  return (
    <>
      <PageViewTracker />
      <CartView selectKey={select} />
    </>
  );
}
