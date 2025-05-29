import OrderHistoryHeroSection from "@/components/order/OrderHistoryHeroSection";
import OrderListSection from "@/components/order/OrderListSection";
import { Container } from "@mui/material";

const OrdersPage = () => {
  return (
    <>
      <Container>
        <OrderHistoryHeroSection />
        <OrderListSection />
      </Container>
    </>
  );
};

export default OrdersPage;
