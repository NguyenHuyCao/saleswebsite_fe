import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import CartView from "@/features/user/cart/CartView";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description:
    "Xem và quản lý giỏ hàng mua sắm của bạn tại Máy 2 Thì – Cường Hoa. Đặt hàng máy cắt cỏ, máy cưa xích, máy thổi lá chính hãng, giao hàng toàn quốc, bảo hành chính hãng.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/cart",
  },
  openGraph: {
    title: "Giỏ hàng | Máy 2 Thì – Cường Hoa",
    description:
      "Xem và quản lý các sản phẩm trong giỏ hàng. Thanh toán nhanh chóng, bảo hành chính hãng, giao hàng toàn quốc.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Giỏ hàng | Máy 2 Thì – Cường Hoa",
    description:
      "Xem và quản lý giỏ hàng. Thanh toán COD, MoMo, VNPAY – giao hàng toàn quốc.",
  },
};

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
