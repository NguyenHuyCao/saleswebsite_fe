"use client";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import WarehouseOverviewView from "./components/overview/WarehouseOverviewView";
import ImportListView from "./components/import/ImportListView";
import POSView from "./components/pos/POSView";
import StockHistoryView from "./components/history/StockHistoryView";

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
  /** Xóa padding + overflow hidden – dùng cho POS full-height */
  fullHeight?: boolean;
}

function TabPanel({ children, value, index, fullHeight }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={fullHeight ? { overflow: "hidden" } : { pt: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

export default function WarehousePage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Kho &amp; Bán hàng
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tổng quan kho" />
          <Tab label="Nhập hàng" />
          <Tab label="Bán tại quầy" />
          <Tab label="Lịch sử giao dịch" />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <WarehouseOverviewView />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <ImportListView />
      </TabPanel>

      <TabPanel value={tab} index={2} fullHeight>
        <POSView />
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <StockHistoryView />
      </TabPanel>
    </Box>
  );
}
