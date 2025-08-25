"use client";

import { useSearchParams } from "next/navigation";
import OrderDetailTable from "../detail/OrderDetailTable";
import OrderListTable from "./table/OrderListTable";

export default function OrdersClientPage() {
  const page = useSearchParams().get("page");
  return page === "detail" ? <OrderDetailTable /> : <OrderListTable />;
}
