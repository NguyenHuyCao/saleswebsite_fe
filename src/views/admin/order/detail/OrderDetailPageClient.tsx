"use client";

import dynamic from "next/dynamic";

const OrderDetailTable = dynamic(
  () => import("@/views/admin/order/detail/OrderDetailTable"),
  { ssr: false }
);

const OrderDetailPageClient = () => {
  return <OrderDetailTable />;
};

export default OrderDetailPageClient;
