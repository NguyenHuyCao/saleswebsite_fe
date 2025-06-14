"use client";

import { useState, useEffect } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Box,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { LineChart, areaElementClasses } from "@mui/x-charts";

const IncomeAreaChart = () => {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const theme = useTheme();
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    "Lượt xem trang": true,
    "Phiên truy cập": true,
  });

  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const fetchTraffic = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/traffic`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (json.status === 200) {
        setWeeklyStats(json.data.weeklyStats);
        setMonthlyStats(json.data.monthlyStats);
      }
    };
    fetchTraffic();
  }, []);

  const weeklyLabels = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "CN",
  ];
  const monthlyLabels = [
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

  const dataFromStats = (stats: any[], key: string, length: number) => {
    const map = new Array(length).fill(0);
    stats.forEach((item: any) => {
      if (view === "weekly") {
        const days = [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ];
        const idx = days.indexOf(item.day);
        if (idx !== -1) map[idx] = item[key];
      } else {
        const idx = item.month - 1;
        if (idx >= 0 && idx < 12) map[idx] = item[key];
      }
    });
    return map;
  };

  const labels = view === "monthly" ? monthlyLabels : weeklyLabels;
  const data1 =
    view === "monthly"
      ? dataFromStats(monthlyStats, "pageViews", 12)
      : dataFromStats(weeklyStats, "pageViews", 7);
  const data2 =
    view === "monthly"
      ? dataFromStats(monthlyStats, "traffic", 12)
      : dataFromStats(weeklyStats, "traffic", 7);

  const toggleVisibility = (label: string) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: data1,
      label: "Lượt xem trang",
      showMark: false,
      area: true,
      id: "PageViews",
      color: "#1976d2", // Màu xanh lam đậm
      visible: visibility["Lượt xem trang"],
    },
    {
      data: data2,
      label: "Phiên truy cập",
      showMark: false,
      area: true,
      id: "Sessions",
      color: "#ff9800", // Màu cam nổi bật
      visible: visibility["Phiên truy cập"],
    },
  ];
  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Lượt truy cập</Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, nextView) => nextView && setView(nextView)}
        >
          <ToggleButton value="monthly">Theo tháng</ToggleButton>
          <ToggleButton value="weekly">Theo tuần</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <LineChart
        grid={{ horizontal: true }}
        xAxis={[
          {
            scaleType: "point",
            data: labels,
            disableLine: true,
            tickLabelStyle: axisFontStyle,
          },
        ]}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: axisFontStyle,
          },
        ]}
        height={400}
        margin={{ top: 40, bottom: 20, right: 20 }}
        series={visibleSeries
          .filter((series) => series.visible)
          .map((series) => ({
            type: "line",
            data: series.data,
            label: series.label,
            showMark: series.showMark,
            area: series.area,
            id: series.id,
            color: series.color,
            stroke: series.color,
            strokeWidth: 2,
          }))}
        slotProps={{ legend: { hidden: true } }}
        sx={{
          [`& .${areaElementClasses.series}-PageViews`]: {
            fill: "url(#gradient1)",
            strokeWidth: 2,
            opacity: 0.8,
          },
          [`& .${areaElementClasses.series}-Sessions`]: {
            fill: "url(#gradient2)",
            strokeWidth: 2,
            opacity: 0.8,
          },
          "& .MuiChartsAxis-directionX .MuiChartsAxis-tick": {
            stroke: theme.palette.divider,
          },
        }}
      >
        <defs>
          <linearGradient id="gradient1" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha("#1976d2", 0.4)} />
            <stop
              offset="90%"
              stopColor={alpha(theme.palette.background.default, 0.4)}
            />
          </linearGradient>
          <linearGradient id="gradient2" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha("#ff9800", 0.4)} />
            <stop
              offset="90%"
              stopColor={alpha(theme.palette.background.default, 0.4)}
            />
          </linearGradient>
        </defs>
      </LineChart>

      <Stack direction="row" spacing={3} justifyContent="center" mt={2}>
        {visibleSeries.map((series) => (
          <Stack
            key={series.label}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => toggleVisibility(series.label)}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: series.visible ? series.color : "grey.500",
              }}
            />
            <Typography variant="body2" color="text.primary">
              {series.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default IncomeAreaChart;
