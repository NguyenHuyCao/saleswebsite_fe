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

interface StatusOption {
  value: string;
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
  month: number;
  revenue: number;
  cost: number;
  profit: number;
}

const SaleReportCard = () => {
  const [value, setValue] = useState<string>("year");
  const [loading, setLoading] = useState<boolean>(true);
  const [today, setToday] = useState<FinancialData | null>(null);
  const [thisMonth, setThisMonth] = useState<FinancialData | null>(null);
  const [thisYear, setThisYear] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/financial-overview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        const { today, thisMonth, thisYear } = result.data;
        setToday(today);
        setThisMonth(thisMonth);
        setThisYear(thisYear);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChartData = () => {
    switch (value) {
      case "today":
        return today ? [today] : [];
      case "month":
        return thisMonth ? [thisMonth] : [];
      case "year":
        return thisYear;
      default:
        return [];
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
            onChange={(e) => setValue(e.target.value)}
            sx={{
              minWidth: 120,
              "& .MuiInputBase-input": { py: 0.75, fontSize: "0.875rem" },
            }}
            SelectProps={{
              MenuProps: {
                disableScrollLock: true,
              },
            }}
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
