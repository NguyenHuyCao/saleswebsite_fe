"use client";

import { useEffect, useMemo, useState } from "react";

// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";

// Icons
import MenuUp from "mdi-material-ui/MenuUp";
import DotsVertical from "mdi-material-ui/DotsVertical";

// Next
import Image from "next/image";

// API
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

interface BrandSaleType {
  name: string;
  logo: string;
  founded: string;
  revenue: number; // always number in state
}

type BrandReportRes = {
  brandSales: Array<{ name: string; logo: string; year: string; total: number }>;
  thisYearTotal: number | string;
  lastYearTotal: number | string;
  growthRate: number | string;
};

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n || 0);

const TotalEarning = () => {
  const [brandSales, setBrandSales] = useState<BrandSaleType[]>([]);
  const [thisYearTotal, setThisYearTotal] = useState<number>(0);
  const [lastYearTotal, setLastYearTotal] = useState<number>(0);
  const [growthRate, setGrowthRate] = useState<number>(0);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await api.get<BrandReportRes>(
          "/api/v1/dashboard/overview/monthly-brand-report",
          { signal: controller.signal },
        );

        const mapped =
          (data?.brandSales || []).map((item: any) => ({
            name: String(item?.name ?? ""),
            logo: String(item?.logo ?? ""),
            founded: String(item?.year ?? ""),
            revenue: Number(item?.total) || 0,
          } as BrandSaleType)) ?? [];

        setBrandSales(mapped);
        setThisYearTotal(Number(data?.thisYearTotal ?? 0));
        setLastYearTotal(Number(data?.lastYearTotal ?? 0));
        setGrowthRate(Number(data?.growthRate ?? 0));
      } catch (err) {
        // Sử dụng helper - nếu là CanceledError sẽ tự động bỏ qua, không log
        logIfNotCanceled(err, "Load monthly brand report failed:");
        // Không cần set state vì đây là lỗi, UI sẽ hiển thị dữ liệu mặc định
      }
    })();

    return () => controller.abort();
  }, []);

  const topBrands = useMemo(
    () => [...brandSales].sort((a, b) => b.revenue - a.revenue).slice(0, 3),
    [brandSales]
  );

  const percent = (value: number, total: number) =>
    total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;

  const positive = growthRate >= 0;

  return (
    <Card>
      <CardHeader
        title="Tổng doanh thu"
        titleTypographyProps={{
          sx: {
            lineHeight: "1.6 !important",
            letterSpacing: "0.15px !important",
          },
        }}
        action={
          <IconButton
            size="small"
            sx={{ color: "text.secondary" }}
            onClick={() => setOpenDetail(true)}
          >
            <DotsVertical />
          </IconButton>
        }
      />

      <CardContent sx={{ pt: (theme) => `${theme.spacing(2.25)} !important` }}>
        <Box sx={{ mb: 1.5, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, fontSize: "2.125rem !important" }}
          >
            {formatVND(thisYearTotal)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: positive ? "success.main" : "error.main",
              ml: 2,
            }}
          >
            <MenuUp
              sx={{
                fontSize: "1.875rem",
                verticalAlign: "middle",
                transform: positive ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.abs(growthRate).toFixed(2)}%
            </Typography>
          </Box>
        </Box>

        <Typography component="p" variant="caption" sx={{ mb: 10 }}>
          So với {formatVND(lastYearTotal)} năm ngoái
        </Typography>

        {topBrands.map((item, index) => (
          <Box
            key={item.name}
            sx={{
              display: "flex",
              alignItems: "center",
              ...(index !== topBrands.length - 1 ? { mb: 8.5 } : {}),
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                mr: 3,
                width: 40,
                height: 40,
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.04),
              }}
            >
              <Image
                src={item.logo || "/logo-placeholder.png"}
                alt={item.name}
                width={40}
                height={20}
                style={{ objectFit: "contain" }}
              />
            </Avatar>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mr: 2, display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}
                >
                  {item.name}
                </Typography>
                <Typography variant="caption">
                  Thành lập: {item.founded}
                </Typography>
              </Box>

              <Box
                sx={{ minWidth: 85, display: "flex", flexDirection: "column" }}
              >
                <Typography
                  variant="body2"
                  sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                >
                  {formatVND(item.revenue)}
                </Typography>
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={percent(item.revenue, thisYearTotal)}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </CardContent>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        <DialogTitle>Chi tiết doanh thu theo thương hiệu</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 400 }}>
          {brandSales.map((item) => (
            <Box
              key={item.name}
              sx={{ display: "flex", alignItems: "center", mb: 4 }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 40,
                  height: 40,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.04),
                }}
              >
                <Image
                  src={item.logo || "/logo-placeholder.png"}
                  alt={item.name}
                  width={40}
                  height={20}
                  style={{ objectFit: "contain" }}
                />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.name} ({item.founded})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Doanh thu: {formatVND(item.revenue)}
                </Typography>
                <LinearProgress
                  sx={{ mt: 1 }}
                  color="primary"
                  variant="determinate"
                  value={percent(item.revenue, thisYearTotal)}
                />
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TotalEarning;
