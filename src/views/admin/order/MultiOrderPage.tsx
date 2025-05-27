"use client";
import { useSearchParams } from "next/navigation";
import OrderTablePage from "./table/OrderListTable";
import OrderDetailPage from "@/app/admin/orders/detail/page";

const MultiOrderPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  if (page === "detail") {
    return <OrderDetailPage />;
  }
  return <OrderTablePage />;
};

export default MultiOrderPage;
