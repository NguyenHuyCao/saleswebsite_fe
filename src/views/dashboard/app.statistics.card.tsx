"use client";

import {
  Box,
  Card,
  Avatar,
  CardHeader,
  IconButton,
  Typography,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactElement, useEffect, useState } from "react";
import TrendingUp from "mdi-material-ui/TrendingUp";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import DotsVertical from "mdi-material-ui/DotsVertical";
import CellphoneLink from "mdi-material-ui/CellphoneLink";
import AccountOutline from "mdi-material-ui/AccountOutline";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

type Period = "week" | "month" | "year";

interface SummaryBlock {
  current: {
    orders: number;
    users: number;
    products: number;
    revenue: number;
  };
  growthRate: {
    orders: number;
    users: number;
    products: number;
    revenue: number;
  };
}

type SummaryRes = {
  week: SummaryBlock;
  month: SummaryBlock;
  year: SummaryBlock;
};

interface DataType {
  title: string;
  value: number;
  growth: number;
  color: string;
  icon: ReactElement;
  unit?: string;
}

const DEFAULT_SUMMARY: SummaryRes = {
  week: {
    current: { orders: 0, users: 0, products: 0, revenue: 0 },
    growthRate: { orders: 0, users: 0, products: 0, revenue: 0 },
  },
  month: {
    current: { orders: 0, users: 0, products: 0, revenue: 0 },
    growthRate: { orders: 0, users: 0, products: 0, revenue: 0 },
  },
  year: {
    current: { orders: 0, users: 0, products: 0, revenue: 0 },
    growthRate: { orders: 0, users: 0, products: 0, revenue: 0 },
  },
};

const StatisticsCard = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<SummaryRes | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await api.get<SummaryRes>(
          "/api/v1/dashboard/overview/summary",
          { signal: controller.signal }, // Thêm signal
        );

        setData({
          week: res?.week ?? DEFAULT_SUMMARY.week,
          month: res?.month ?? DEFAULT_SUMMARY.month,
          year: res?.year ?? DEFAULT_SUMMARY.year,
        });
      } catch (err) {
        // Sử dụng helper để chỉ log khi không phải CanceledError
        logIfNotCanceled(err, "Fetch summary error:");
        setData(DEFAULT_SUMMARY);
      }
    })();

    return () => controller.abort(); // Cleanup với AbortController
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleSelectPeriod = (value: Period) => {
    setPeriod(value);
    setAnchorEl(null);
  };

  const summary = data?.[period];
  const current = summary?.current;
  const growth = summary?.growthRate;

  const formatGrowth = (value: number) => {
    const isPositive = (value ?? 0) >= 0;
    return (
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        color={isPositive ? "success.main" : "error.main"}
      >
        {isPositive ? (
          <ArrowUpward fontSize="small" />
        ) : (
          <ArrowDownward fontSize="small" />
        )}
        <Typography variant="caption" color="inherit">
          {Math.abs(value ?? 0).toFixed(2)}%
        </Typography>
      </Stack>
    );
  };

  const statsData: DataType[] =
    current && growth
      ? [
          {
            title: "Đơn hàng",
            value: Number(current.orders ?? 0),
            growth: Number(growth.orders ?? 0),
            color: theme.palette.primary.main,
            icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
          },
          {
            title: "Khách hàng",
            value: Number(current.users ?? 0),
            growth: Number(growth.users ?? 0),
            color: theme.palette.success.main,
            icon: <AccountOutline sx={{ fontSize: "1.75rem" }} />,
          },
          {
            title: "Sản phẩm mới",
            value: Number(current.products ?? 0),
            growth: Number(growth.products ?? 0),
            color: theme.palette.warning.main,
            icon: <CellphoneLink sx={{ fontSize: "1.75rem" }} />,
          },
          {
            title: "Doanh thu",
            value: Number(current.revenue ?? 0),
            growth: Number(growth.revenue ?? 0),
            color: theme.palette.info.main,
            icon: <CurrencyUsd sx={{ fontSize: "1.75rem" }} />,
            unit: "₫",
          },
        ]
      : [];

  return (
    <Card sx={{ px: 4, pb: 4 }}>
      <CardHeader
        title="Thống kê tổng quan"
        action={
          <>
            <IconButton size="small" onClick={handleMenuOpen}>
              <DotsVertical />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              disableScrollLock
            >
              <MenuItem onClick={() => handleSelectPeriod("week")}>
                Tuần này
              </MenuItem>
              <MenuItem onClick={() => handleSelectPeriod("month")}>
                Tháng này
              </MenuItem>
              <MenuItem onClick={() => handleSelectPeriod("year")}>
                Năm nay
              </MenuItem>
            </Menu>
          </>
        }
        subheader={
          <Typography variant="body2">
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {period === "week"
                ? "Theo tuần"
                : period === "month"
                  ? "Theo tháng"
                  : "Theo năm"}
            </Box>{" "}
            - So sánh với kỳ trước
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {statsData.map((item, index) => (
            <Grid size={{ xs: 12, sm: 3 }} key={index}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    mr: 3,
                    width: 44,
                    height: 44,
                    boxShadow: 3,
                    color: "common.white",
                    backgroundColor: item.color,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h6">
                    {item.value.toLocaleString("vi-VN")} {item.unit || ""}
                  </Typography>
                  {formatGrowth(item.growth)}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
