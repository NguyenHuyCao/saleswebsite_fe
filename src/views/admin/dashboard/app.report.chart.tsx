"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { LineChart, chartsGridClasses } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";

interface MonthlyData {
  month: number;
  revenue: number;
  cost: number;
  profit: number;
}

const ReportChart = () => {
  const theme = useTheme();
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        "http://localhost:8080/api/v1/dashboard/advanced/revenue-cost-profit",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      if (json.status === 200) {
        // Lọc bỏ tháng không có giá trị
        const filtered = json.data.monthlyRevenueCostProfit.filter(
          (m: MonthlyData) => m.revenue > 0 || m.cost > 0 || m.profit > 0
        );
        setData(filtered);
      }
    };
    fetchChartData();
  }, []);

  const labels = data.map((item) => `Th${item.month}`);
  const revenues = data.map((item) => item.revenue / 1_000_000); // đơn vị: triệu
  const costs = data.map((item) => item.cost / 1_000_000);
  const profits = data.map((item) => item.profit / 1_000_000);

  return (
    <Box sx={{ px: 3, pt: 1 }}>
      <LineChart
        grid={{ horizontal: true }}
        xAxis={[
          {
            data: labels,
            scaleType: "point",
            tickLabelStyle: { fill: theme.palette.text.primary },
          },
        ]}
        yAxis={[
          {
            label: "Đơn vị: triệu ₫",
            labelStyle: {
              fill: theme.palette.text.secondary,
              fontSize: 12,
              textAnchor: "start",
              transform: "translate(-30, 0)",
            },
            tickFormat: (val: number) => `${val}M`,
          },
        ]}
        series={[
          {
            data: revenues,
            label: "Doanh thu",
            color: theme.palette.success.main,
            showMark: true,
          },
          {
            data: costs,
            label: "Chi phí",
            color: theme.palette.primary.main,
            showMark: true,
          },
          {
            data: profits,
            label: "Lợi nhuận",
            color: theme.palette.warning.main,
            showMark: true,
          },
        ]}
        slotProps={{ legend: { hidden: false } }}
        height={320}
        margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
        sx={{
          "& .MuiLineElement-root": { strokeWidth: 2 },
          [`& .${chartsGridClasses.line}`]: { strokeDasharray: "4 4" },
        }}
      />
    </Box>
  );
};

export default ReportChart;
