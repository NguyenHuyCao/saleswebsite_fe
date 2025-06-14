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

interface DataType {
  title: string;
  value: number;
  growth: number;
  color: string;
  icon: ReactElement;
  unit?: string;
}

const StatisticsCard = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        if (json.status === 200) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Fetch summary error:", error);
      }
    };
    fetchData();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectPeriod = (value: "week" | "month" | "year") => {
    setPeriod(value);
    setAnchorEl(null);
  };

  const summary = data?.[period];
  const current = summary?.current;
  const growth = summary?.growthRate;

  const formatGrowth = (value: number) => {
    const isPositive = value >= 0;
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
          {Math.abs(value).toFixed(2)}%
        </Typography>
      </Stack>
    );
  };

  const statsData: DataType[] = current
    ? [
        {
          title: "Đơn hàng",
          value: current.orders,
          growth: growth.orders.growthRate,
          color: theme.palette.primary.main,
          icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
        },
        {
          title: "Khách hàng",
          value: current.users,
          growth: growth.users.growthRate,
          color: theme.palette.success.main,
          icon: <AccountOutline sx={{ fontSize: "1.75rem" }} />,
        },
        {
          title: "Sản phẩm 2 thì",
          value: current.products,
          growth: growth.products.growthRate,
          color: theme.palette.warning.main,
          icon: <CellphoneLink sx={{ fontSize: "1.75rem" }} />,
        },
        {
          title: "Doanh thu",
          value: current.revenue,
          growth: growth.revenue.growthRate,
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
              disableScrollLock={true}
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
