"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { LineChart, chartsGridClasses } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

interface MonthlyData {
  month: number;
  revenue: number;
  cost: number;
  profit: number;
}

type AdvancedReportPayload =
  | { monthlyRevenueCostProfit?: MonthlyData[] }
  | { result?: { monthlyRevenueCostProfit?: MonthlyData[] } };

const ReportChart = () => {
  const theme = useTheme();
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const payload = await api.get<AdvancedReportPayload>(
          "/api/v1/dashboard/advanced/revenue-cost-profit",
          { signal: controller.signal },
        );

        const list =
          (payload as any)?.monthlyRevenueCostProfit ??
          (payload as any)?.result?.monthlyRevenueCostProfit ??
          [];

        const filtered = (Array.isArray(list) ? list : []).filter(
          (m: MonthlyData) => m.revenue > 0 || m.cost > 0 || m.profit > 0,
        );

        setData(filtered);
      } catch (err) {
        // Sử dụng helper để chỉ log khi không phải CanceledError
        logIfNotCanceled(err, "Lỗi tải dữ liệu biểu đồ:");
        setData([]);
      }
    })();

    return () => controller.abort();
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
            valueFormatter: (val: number) => `${val}M`,
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
        slotProps={{
          legend: {
            position: { vertical: "bottom", horizontal: "center" },
          },
        }}
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
