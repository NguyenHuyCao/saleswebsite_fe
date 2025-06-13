import ConfirmButton from "@/components/checkout/ConfirmButton";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import ShippingForm from "@/components/checkout/ShippingForm";
// import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container, Grid } from "@mui/material";

const CheckoutPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <Grid container spacing={2} mt={5} mb={10}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <ShippingForm />
          {/* <ShippingMethod /> */}
          <PaymentMethod />
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <OrderSummary />
          <ConfirmButton />
        </Grid>
      </Grid>
      {/* <FreezeScrollOnReload /> */}
    </Container>
  );
};

export default CheckoutPage;
