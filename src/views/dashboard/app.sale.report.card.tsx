"use client";

import { useEffect, useState } from "react";
import {
  Grid,
  MenuItem,
  TextField,
  Typography,
  Card,
  Box,
  CircularProgress,
} from "@mui/material";
import SalesChart from "@/components/dashboard/SalesChart";
import { api, toApiError } from "@/lib/api/http";

interface StatusOption {
  value: "today" | "month" | "year";
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: "today", label: "Hôm nay" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm nay" },
];

interface FinancialData {
  revenue: number;
  cost: number;
  profit: number;
}

interface MonthlyData {
  month: number; // 1..12
  revenue: number;
  cost: number;
  profit: number;
}

type FinancialOverviewRes = {
  today: FinancialData | null;
  thisMonth: FinancialData | null;
  thisYear: MonthlyData[];
};

const DEFAULT_OVERVIEW: FinancialOverviewRes = {
  today: { revenue: 0, cost: 0, profit: 0 },
  thisMonth: { revenue: 0, cost: 0, profit: 0 },
  thisYear: [],
};

const SaleReportCard = () => {
  const [value, setValue] = useState<StatusOption["value"]>("year");
  const [loading, setLoading] = useState<boolean>(true);
  const [today, setToday] = useState<FinancialData | null>(null);
  const [thisMonth, setThisMonth] = useState<FinancialData | null>(null);
  const [thisYear, setThisYear] = useState<MonthlyData[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Dùng Axios instance đã gắn Authorization từ localStorage (http.ts)
        const data = await api.get<FinancialOverviewRes>(
          "/api/v1/dashboard/overview/financial-overview"
        );
        if (!mounted) return;

        const safe = {
          today: data?.today ?? DEFAULT_OVERVIEW.today,
          thisMonth: data?.thisMonth ?? DEFAULT_OVERVIEW.thisMonth,
          thisYear: Array.isArray(data?.thisYear) ? data!.thisYear : [],
        };

        setToday(safe.today);
        setThisMonth(safe.thisMonth);
        setThisYear(safe.thisYear);
      } catch (e) {
        const err = toApiError(e);
        console.warn("Load financial overview failed:", err.message);
        if (!mounted) return;
        setToday(DEFAULT_OVERVIEW.today);
        setThisMonth(DEFAULT_OVERVIEW.thisMonth);
        setThisYear(DEFAULT_OVERVIEW.thisYear);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getChartData = () => {
    switch (value) {
      case "today":
        return today ? [today] : [];
      case "month":
        return thisMonth ? [thisMonth] : [];
      case "year":
      default:
        return thisYear;
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid>
          <Typography variant="h6">Báo cáo doanh thu</Typography>
        </Grid>
        <Grid>
          <TextField
            id="select-report-range"
            select
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value as StatusOption["value"])}
            sx={{
              minWidth: 120,
              "& .MuiInputBase-input": { py: 0.75, fontSize: "0.875rem" },
            }}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <SalesChart filter={value} data={getChartData()} />
        )}
      </Box>
    </Card>
  );
};

export default SaleReportCard;
