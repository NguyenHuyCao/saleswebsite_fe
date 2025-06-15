"use client";
import { useSearchParams } from "next/navigation";
import OrderTablePage from "./table/OrderListTable";
import OrderDetailView from "@/views/admin/order/detail/OrderDetailView";

const MultiOrderPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  if (page === "detail") {
    return <OrderDetailView />;
  }
  return <OrderTablePage />;
};

export default MultiOrderPage;
