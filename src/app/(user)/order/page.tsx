import OrderHistoryHeroSection from "@/components/order/OrderHistoryHeroSection";
import OrderListSection from "@/components/order/OrderListSection";
import PageViewTracker from "@/components/traffic/PageViewTracker";
import { Container } from "@mui/material";

const OrdersPage = () => {
  return (
    <>
      <PageViewTracker />
      <Container>
        <OrderHistoryHeroSection />
        <OrderListSection />
      </Container>
    </>
  );
};

export default OrdersPage;
