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
import { api, toApiError } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

type TrafficWeeklyItem = {
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  pageViews: number;
  traffic: number;
};

type TrafficMonthlyItem = {
  month: number; // 1..12
  pageViews: number;
  traffic: number;
};

type TrafficRes = {
  weeklyStats: TrafficWeeklyItem[];
  monthlyStats: TrafficMonthlyItem[];
};

const IncomeAreaChart = () => {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const theme = useTheme();
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    "Lượt xem trang": true,
    "Phiên truy cập": true,
  });

  const [weeklyStats, setWeeklyStats] = useState<TrafficWeeklyItem[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<TrafficMonthlyItem[]>([]);

  useEffect(() => {
    const controller = new AbortController(); 
    (async () => {
      try {
        const data = await api.get<TrafficRes>(
          "/api/v1/dashboard/overview/traffic",
          { signal: controller.signal },
        );
        setWeeklyStats(data.weeklyStats ?? []);
        setMonthlyStats(data.monthlyStats ?? []);
      } catch (err) {
        logIfNotCanceled(err, "Load traffic failed:");
        setWeeklyStats([]);
        setMonthlyStats([]);
      }
    })();
    return () => controller.abort();
  }, []);

  const weeklyLabels = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"];
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

  const dataFromStats = (
    stats: any[],
    key: "pageViews" | "traffic",
    length: number
  ) => {
    const map = new Array<number>(length).fill(0);
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
        if (idx !== -1) map[idx] = Number(item[key] ?? 0);
      } else {
        const idx = Number(item.month ?? 0) - 1;
        if (idx >= 0 && idx < 12) map[idx] = Number(item[key] ?? 0);
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

  const toggleVisibility = (label: string) =>
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));

  const visibleSeries = [
    {
      data: data1,
      label: "Lượt xem trang",
      showMark: false,
      area: true,
      id: "PageViews",
      color: "#1976d2",
      visible: visibility["Lượt xem trang"],
    },
    {
      data: data2,
      label: "Phiên truy cập",
      showMark: false,
      area: true,
      id: "Sessions",
      color: "#ff9800",
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
          .filter((s) => s.visible)
          .map((s) => ({
            type: "line",
            data: s.data,
            label: s.label,
            showMark: s.showMark,
            area: s.area,
            id: s.id,
            color: s.color,
            stroke: s.color,
            strokeWidth: 2,
          }))}
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
        {visibleSeries.map((s) => (
          <Stack
            key={s.label}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => toggleVisibility(s.label)}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: s.visible ? s.color : "grey.500",
              }}
            />
            <Typography variant="body2" color="text.primary">
              {s.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default IncomeAreaChart;
