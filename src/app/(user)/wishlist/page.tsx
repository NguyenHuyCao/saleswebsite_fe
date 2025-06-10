"use client";

import PageViewTracker from "@/components/traffic/PageViewTracker";
import WishlistHeroSection from "@/components/wishlist/WishlistHeroSection";
import WishlistPage from "@/components/wishlist/WishlistPage";
import { Box, Container } from "@mui/material";

// const demoProduct: Product = {
//   id: "demo-001",
//   name: "Máy khoan cầm tay Bosch GSB 550",
//   image: "/images/product/images.jpeg",
//   inStock: true,
// };

const WishListPage = () => {
  return (
    <>
      <PageViewTracker />
      <WishlistHeroSection />
      <Container>
        <Box mt={4}>
          <WishlistPage />
        </Box>
      </Container>
    </>
  );
};

export default WishListPage;
