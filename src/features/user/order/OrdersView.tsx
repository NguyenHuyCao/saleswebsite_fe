"use client";

import { Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
import { useState } from "react";
import type { Dayjs } from "dayjs";
import OrderHistoryHeroSection from "./components/OrderHistoryHeroSection";
import OrderStats from "./components/OrderStats";
import OrderFilters from "./components/OrderFilters";
import OrderListSection from "./components/OrderListSection";

export default function OrdersView() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>({
    start: null,
    end: null,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <OrderHistoryHeroSection />
        <OrderStats />
        <OrderFilters
          filterStatus={filterStatus}
          onFilterStatusChange={(v) => { setFilterStatus(v); }}
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
