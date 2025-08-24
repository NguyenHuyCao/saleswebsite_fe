import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import OrdersView from "@/features/order";

export default function OrdersPage() {
  return (
    <>
      <PageViewTracker />
      <Container sx={{ py: 4 }}>
        <OrdersView />
      </Container>
    </>
  );
}
