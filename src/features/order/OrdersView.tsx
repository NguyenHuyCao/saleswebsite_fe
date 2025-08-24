"use client";

import { Box } from "@mui/material";
import OrderHistoryHeroSection from "./components/OrderHistoryHeroSection";
import OrderListSection from "./components/OrderListSection";

export default function OrdersView() {
  return (
    <Box>
      <OrderHistoryHeroSection />
      <OrderListSection />
    </Box>
  );
}
