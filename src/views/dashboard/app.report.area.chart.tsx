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

const DashboardDefault = () => {
  const [insights, setInsights] = useState({
    profitMargin: 0,
    costRatio: 0,
    riskLevel: "Chưa rõ",
  });

  useEffect(() => {
    const fetchInsights = async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/advanced/financial-insights`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      if (json.status === 200) {
        setInsights(json.data);
      }
    };
    fetchInsights();
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
