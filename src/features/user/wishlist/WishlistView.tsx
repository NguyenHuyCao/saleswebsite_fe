// wishlist/WishlistView.tsx
"use client";

import { Container, Box } from "@mui/material";
import { useState } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import WishlistHeroSection from "./components/WishlistHeroSection";
import WishlistStats from "./components/WishlistStats";
import WishlistToolbar from "./components/WishlistToolbar";
import WishlistGrid from "./components/WishlistGrid";
import WishlistShareModal from "./components/WishlistShareModal";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { useWishlist } from "./queries";

const WishlistView = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { data: items = [] } = useWishlist();

  return (
    <SnackbarProvider>
      <PageViewTracker />

      {/* Hero Section với số liệu nổi bật */}
      <WishlistHeroSection />

      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Stats Cards hiện đại */}
          <WishlistStats />

          {/* Toolbar gọn gàng */}
          <WishlistToolbar />

          {/* Product Grid tối ưu */}
          <WishlistGrid />
        </Box>
      </Container>

      {/* Share Modal */}
      <WishlistShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </SnackbarProvider>
  );
};

export default WishlistView;
