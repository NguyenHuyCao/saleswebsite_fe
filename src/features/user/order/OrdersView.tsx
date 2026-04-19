// order/OrdersView.tsx
"use client";

import { Container, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
import { useState } from "react";
import { Dayjs } from "dayjs"; // THÊM IMPORT
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import OrderHistoryHeroSection from "./components/OrderHistoryHeroSection";
import OrderStats from "./components/OrderStats";
import OrderFilters from "./components/OrderFilters";
import OrderListSection from "./components/OrderListSection";

export default function OrdersView() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    start: Dayjs | null; // ĐỔI KIỂU SANG Dayjs
    end: Dayjs | null;
  }>({
    start: null,
    end: null,
  });


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <PageViewTracker />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <OrderHistoryHeroSection />
        <OrderStats />
        <OrderFilters
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <OrderListSection
          filterStatus={filterStatus}
          searchTerm={searchTerm}
          dateRange={dateRange}
        />
      </Container>
    </LocalizationProvider>
  );
}
