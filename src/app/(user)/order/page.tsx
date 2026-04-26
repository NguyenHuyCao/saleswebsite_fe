import type { Metadata } from "next";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { OrdersView } from "@/features/user/order";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi | Cường Hoa",
  description:
    "Theo dõi và quản lý lịch sử đơn hàng của bạn tại Cường Hoa. Xem trạng thái giao hàng, thông tin thanh toán và lịch sử mua sắm.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Đơn hàng của tôi | Cường Hoa",
    description:
      "Quản lý lịch sử đơn hàng, theo dõi trạng thái giao hàng tại Cường Hoa.",
    type: "website",
  },
};

export default function OrdersPage() {
  return (
    <>
      <PageViewTracker />
      <OrdersView />
    </>
  );
}
