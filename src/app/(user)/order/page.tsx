import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { OrdersView } from "@/features/user/order";

export default function OrdersPage() {
  return (
    <>
      <PageViewTracker />
      <OrdersView />
    </>
  );
}
