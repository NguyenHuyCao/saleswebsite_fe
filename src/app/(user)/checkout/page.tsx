import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import CheckoutView from "@/features/user/checkout/CheckoutView";

export default function CheckoutPage() {
  return (
    <Container maxWidth="lg">
      <PageViewTracker />
      <CheckoutView />
    </Container>
  );
}
