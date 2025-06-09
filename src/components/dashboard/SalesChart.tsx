"use client";

import { Typography, Card, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts";
import { useState } from "react";

const axisFontStyle = (theme: any) => ({
  fontSize: 10,
  fill: theme.palette.text.secondary,
});

export default function DashboardSalesChart() {
  const theme = useTheme();
  const [showIncome, setShowIncome] = useState(true);
  const [showCostOfSales, setShowCostOfSales] = useState(true);

  const handleIncomeChange = () => setShowIncome((prev) => !prev);
  const handleCostOfSalesChange = () => setShowCostOfSales((prev) => !prev);

  const labels = [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ];

  const valueFormatter = (value: number) => `$ ${value} Nghìn`;

  const data = [
    {
      data: [180, 90, 135, 114, 120, 145, 170, 200, 170, 230, 210, 180],
      label: "Doanh thu",
      color: theme.palette.warning.main,
      valueFormatter,
    },
    {
      data: [120, 45, 78, 150, 168, 99, 180, 220, 180, 210, 220, 200],
      label: "Giá vốn",
      color: theme.palette.primary.main,
      valueFormatter,
    },
  ];

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
            Lợi nhuận ròng
          </Typography>
          <Typography variant="h4">$1560</Typography>
        </Box>
        <Box>
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
      </Box>

      <BarChart
        height={380}
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
            tickMaxStep: 20,
            tickLabelStyle: axisFontStyle(theme),
          },
        ]}
        series={data
          .filter(
            (series) =>
              (series.label === "Doanh thu" && showIncome) ||
              (series.label === "Giá vốn" && showCostOfSales)
          )
          .map((series) => ({ ...series, type: "bar" }))}
        slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
        axisHighlight={{ x: "none" }}
        margin={{ top: 30, left: 40, right: 10 }}
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
