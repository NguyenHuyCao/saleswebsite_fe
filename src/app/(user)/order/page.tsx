import OrderHistoryHeroSection from "@/components/order/OrderHistoryHeroSection";
import OrderListSection from "@/components/order/OrderListSection";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";
// import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";

const OrdersPage = () => {
  return (
    <>
      <PageViewTracker />
      <Container>
        <OrderHistoryHeroSection />
        <OrderListSection />
      </Container>
      {/* <FreezeScrollOnReload /> */}
    </>
  );
};

export default OrdersPage;
