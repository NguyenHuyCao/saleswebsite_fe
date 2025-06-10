"use client";

import { Typography, Card, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts";
import { useState } from "react";

interface FinancialData {
  revenue: number;
  cost: number;
  profit: number;
}

interface MonthlyData {
  month: number;
  revenue: number;
  cost: number;
  profit: number;
}

interface SalesChartProps {
  filter: "today" | "month" | "year";
  data: FinancialData[] | MonthlyData[];
}

const axisFontStyle = (theme: any) => ({
  fontSize: 10,
  fill: theme.palette.text.secondary,
});

export default function SalesChart({ filter, data }: SalesChartProps) {
  const theme = useTheme();
  const [showIncome, setShowIncome] = useState(true);
  const [showCostOfSales, setShowCostOfSales] = useState(true);

  const handleIncomeChange = () => setShowIncome((prev) => !prev);
  const handleCostOfSalesChange = () => setShowCostOfSales((prev) => !prev);

  const isYearly = filter === "year";

  const labels = isYearly
    ? (data as MonthlyData[]).map((item) => `Th${item.month}`)
    : ["Hiện tại"];

  const revenueData = data.map((item) => Math.round(item.revenue / 1000));
  const costData = data.map((item) => Math.round(item.cost / 1000));
  const profitTotal = data.reduce((sum, item) => sum + item.profit, 0);

  const valueFormatter = (value: number) => `${value}K ₫`;

  const series = [];

  if (showIncome) {
    series.push({
      data: revenueData,
      label: "Doanh thu",
      color: theme.palette.warning.main,
      valueFormatter,
    });
  }

  if (showCostOfSales) {
    series.push({
      data: costData,
      label: "Giá vốn",
      color: theme.palette.primary.main,
      valueFormatter,
    });
  }

  return (
    <Card sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Tổng lợi nhuận ròng
          </Typography>
          <Typography variant="h4">{profitTotal.toLocaleString()} ₫</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <label>
            <input
              type="checkbox"
              checked={showIncome}
              onChange={handleIncomeChange}
              style={{ accentColor: theme.palette.warning.main }}
            />
            <Typography variant="body2" component="span" ml={0.5}>
              Doanh thu
            </Typography>
          </label>
          <label>
            <input
              type="checkbox"
              checked={showCostOfSales}
              onChange={handleCostOfSalesChange}
              style={{ accentColor: theme.palette.primary.main }}
            />
            <Typography variant="body2" component="span" ml={0.5}>
              Giá vốn
            </Typography>
          </label>
        </Stack>
      </Box>

      <BarChart
        height={360}
        grid={{ horizontal: true }}
        xAxis={[
          {
            data: labels,
            scaleType: "band",
            tickLabelStyle: { ...axisFontStyle(theme), fontSize: 12 },
          },
        ]}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: axisFontStyle(theme),
          },
        ]}
        series={series.map((s) => ({ ...s, type: "bar" }))}
        margin={{ top: 30, left: 40, right: 10 }}
        slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
        axisHighlight={{ x: "none" }}
        tooltip={{ trigger: "item" }}
        sx={{
          "& .MuiBarElement-root:hover": { opacity: 0.6 },
          "& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line":
            {
              stroke: theme.palette.divider,
            },
        }}
      />
    </Card>
  );
}
