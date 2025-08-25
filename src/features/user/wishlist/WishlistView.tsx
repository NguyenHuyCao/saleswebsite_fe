"use client";

import { Container, Box } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import WishlistHeroSection from "./components/WishlistHeroSection";
import WishlistGrid from "./components/WishlistGrid";

const WishlistView = () => {
  return (
    <>
      <PageViewTracker />
      <Container>
        <WishlistHeroSection />
        <Box mt={4}>
          <WishlistGrid />
        </Box>
      </Container>
    </>
  );
};

export default WishlistView;
