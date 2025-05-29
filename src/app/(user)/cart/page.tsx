import CartHeroSection from "@/components/cart/CartHeroSection";
import CartItemList from "@/components/cart/CartItemList";
import CartSummary from "@/components/cart/CartSummary";
import ContactCTA from "@/components/cart/NewsletterBanner";
import { Box, Container, Grid } from "@mui/material";

const CartPage = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <CartHeroSection />
      <Grid container spacing={4} mt={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <CartItemList />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary />
        </Grid>
      </Grid>
      <Box sx={{ md: 6 }}>
        <ContactCTA />
      </Box>
    </Container>
  );
};

export default CartPage;
