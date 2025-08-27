"use client";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";

// ** React Imports
import { useEffect, useState } from "react";

// ** Custom Components Imports
import ReactApexcharts from "src/@core/components/react-apexcharts";
import type { ApexOptions } from "apexcharts";

// ** http/api custom
import { api } from "@/lib/api/http";

// ---------- Types ----------
type Period = "twoWeeksAgo" | "lastWeek" | "thisWeek";

type DayKey =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

interface DailyPoint {
  day: DayKey;
  revenue: number;
}

interface WeekBlock {
  range: string; // ví dụ "01/08 - 07/08"
  daily: DailyPoint[];
  total?: number;
}

interface WeeklyPerformance {
  growthRate: number; // % so với tuần trước
}

interface WeeklyRevenueResponse {
  twoWeeksAgo: WeekBlock;
  lastWeek: WeekBlock;
  thisWeek: WeekBlock;
  weeklyPerformance?: WeeklyPerformance;
}

// ---------- Component ----------
const WeeklyOverview = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [period, setPeriod] = useState<Period>("thisWeek");
  const [data, setData] = useState<WeeklyRevenueResponse | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        // http/api custom sẽ tự gắn Authorization nếu có token trong localStorage
        const payload = await api.get<WeeklyRevenueResponse>(
          "/api/v1/dashboard/overview/weekly-revenue",
          { signal: controller.signal }
        );
        setData(payload);
      } catch (error) {
        console.error("Fetch weekly revenue error:", error);
        setData(null); // fail-soft
      }
    })();

    return () => controller.abort();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleSelectPeriod = (value: Period) => {
    setPeriod(value);
    setAnchorEl(null);
  };

  const mapDays: Record<DayKey, string> = {
    SUNDAY: "CN",
    MONDAY: "T2",
    TUESDAY: "T3",
    WEDNESDAY: "T4",
    THURSDAY: "T5",
    FRIDAY: "T6",
    SATURDAY: "T7",
  };

  const currentData = data?.[period];
  const chartCategories =
    currentData?.daily.map((d: DailyPoint) => mapDays[d.day]) ?? [];
  const chartSeries = [
    {
      name: "Doanh thu",
      data: currentData?.daily.map((d: DailyPoint) => d.revenue) ?? [],
    },
  ];

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: "40%",
        endingShape: "rounded",
        startingShape: "rounded",
      },
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper],
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: { top: -1, right: 0, left: -12, bottom: 5 },
    },
    dataLabels: { enabled: false },
    colors: Array(7).fill(theme.palette.primary.main),
    xaxis: {
      categories: chartCategories,
      tickPlacement: "on",
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -17,
        formatter: (value: number) =>
          `$${
            value >= 1_000_000
              ? `${(value / 1_000_000).toFixed(0)}M`
              : (value / 1_000).toFixed(0)
          }k`,
      },
    },
  };

  const growth =
    data?.weeklyPerformance?.growthRate != null
      ? data.weeklyPerformance.growthRate.toFixed(2)
      : undefined;
  const isPositive =
    growth != null ? parseFloat(growth || "0") >= 0 : undefined;

  return (
    <Card>
      <CardHeader
        title="Tổng quan tuần"
        titleTypographyProps={{
          sx: {
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
        action={
          <>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ color: "text.secondary" }}
            >
              <DotsVertical />
            </IconButton>
            <Menu
              disableScrollLock
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleSelectPeriod("twoWeeksAgo")}>
                2 tuần trước
              </MenuItem>
              <MenuItem onClick={() => handleSelectPeriod("lastWeek")}>
                Tuần trước
              </MenuItem>
              <MenuItem onClick={() => handleSelectPeriod("thisWeek")}>
                Tuần này
              </MenuItem>
            </Menu>
          </>
        }
      />
      <CardContent
        sx={{ "& .apexcharts-xcrosshairs.apexcharts-active": { opacity: 0 } }}
      >
        <ReactApexcharts
          type="bar"
          height={215}
          options={options}
          series={chartSeries}
        />

        {data?.weeklyPerformance && period === "thisWeek" && growth != null && (
          <Box sx={{ mb: 7, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h5"
              sx={{
                mr: 4,
                color: isPositive ? "success.main" : "error.main",
              }}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(parseFloat(growth)).toFixed(2)}
              %
            </Typography>
            <Typography variant="body2">
              Hiệu suất bán hàng {isPositive ? "tăng" : "giảm"}{" "}
              {Math.abs(parseFloat(growth)).toFixed(2)}% so với tuần trước
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={() => setOpenDetail(true)}
        >
          Xem chi tiết
        </Button>
      </CardContent>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        <DialogTitle>Chi tiết doanh thu {currentData?.range}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Thứ</TableCell>
                  <TableCell align="right">Doanh thu</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(currentData?.daily ?? []).map((d, index) => (
                  <TableRow key={index}>
                    <TableCell>{mapDays[d.day as DayKey]}</TableCell>
                    <TableCell align="right">
                      {d.revenue.toLocaleString("vi-VN")} ₫
                    </TableCell>
                  </TableRow>
                ))}
                {(!currentData || currentData.daily.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default WeeklyOverview;
