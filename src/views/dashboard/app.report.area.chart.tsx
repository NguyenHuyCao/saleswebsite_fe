"use client";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Card,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import ReportChart from "./app.report.chart";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

type Insights = {
  profitMargin: number; // %
  costRatio: number; // %
  riskLevel: string;
};

const DEFAULT_INSIGHTS: Insights = {
  profitMargin: 0,
  costRatio: 0,
  riskLevel: "Chưa rõ",
};

const DashboardDefault = () => {
  const [insights, setInsights] = useState<Insights>(DEFAULT_INSIGHTS);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await api.get<Insights>(
          "/api/v1/dashboard/advanced/financial-insights",
          { signal: controller.signal }, // Thêm signal
        );
        setInsights({
          profitMargin: Number(data?.profitMargin ?? 0),
          costRatio: Number(data?.costRatio ?? 0),
          riskLevel: String(data?.riskLevel ?? "Chưa rõ"),
        });
      } catch (err) {
        // Sử dụng helper để chỉ log khi không phải CanceledError
        logIfNotCanceled(err, "Load financial insights failed:");
        setInsights(DEFAULT_INSIGHTS);
      }
    })();

    return () => controller.abort(); // Cleanup với AbortController
  }, []);

  return (
    <Box>
      <Card sx={{ px: 2, py: 3, height: "100%" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Báo cáo phân tích
        </Typography>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Tăng trưởng tài chính công ty" />
              <Typography variant="h6" color="success.main">
                +{insights.profitMargin.toFixed(2)}%
              </Typography>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Tỷ lệ chi phí doanh nghiệp" />
              <Typography variant="h6" color="primary.main">
                {insights.costRatio.toFixed(2)}%
              </Typography>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Rủi ro kinh doanh" />
              <Typography variant="h6" color="warning.main">
                {insights.riskLevel}
              </Typography>
            </ListItemButton>
          </ListItem>
        </List>

        <ReportChart />
      </Card>
    </Box>
  );
};

export default DashboardDefault;
