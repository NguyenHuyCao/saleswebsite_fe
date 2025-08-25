"use client";

import {
  Card,
  Button,
  Typography,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  Box,
  Stack,
  Divider,
  ButtonGroup,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import ReactApexChart from "@/components/wrapper/ApexChart";
import { ApexOptions } from "apexcharts";

// Styled
const TriangleImg = styled("img")({
  right: 0,
  bottom: 0,
  height: 170,
  position: "absolute",
});

const TrophyImg = styled("img")({
  right: 36,
  bottom: 20,
  height: 98,
  position: "absolute",
});

// Type
interface BestSellingProduct {
  revenue: number;
  productId: number;
  lastMonthRevenue: number;
  name: string;
  quantityGrowthRate: number;
  quantitySold: number;
  revenueGrowthRate: number;
  lastMonthQuantity: number;
}

// Helper
const formatCurrency = (value?: number | null): string =>
  value != null ? value.toLocaleString("vi-VN") + "₫" : "0₫";

const Trophy = () => {
  const theme = useTheme();
  const imageSrc =
    theme.palette.mode === "light" ? "triangle-light.png" : "triangle-dark.png";
  const [product, setProduct] = useState<BestSellingProduct | null>(null);
  const [open, setOpen] = useState(false);
  const [chartMode, setChartMode] = useState<"revenue" | "quantity">("revenue");
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "45%", borderRadius: 6 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Tháng trước", "Tháng này"],
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toLocaleString("vi-VN"),
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/best-selling-one`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        if (json.status === 200 && json.data) {
          setProduct(json.data);
        } else {
          console.warn("Dữ liệu không hợp lệ:", json);
        }
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm bán chạy:", err);
      }
    };

    fetchData();
  }, []);

  const chartSeries =
    product && chartMode === "revenue"
      ? [
          {
            name: "Doanh thu (₫)",
            data: [product.lastMonthRevenue ?? 0, product.revenue ?? 0],
          },
        ]
      : product
      ? [
          {
            name: "Số lượng bán",
            data: [product.lastMonthQuantity ?? 0, product.quantitySold ?? 0],
          },
        ]
      : [];

  return (
    <>
      <Card sx={{ position: "relative", minHeight: 210 }}>
        <CardContent>
          <Typography variant="h6">Sản phẩm bán chạy nhất</Typography>
          <Typography variant="body2" sx={{ letterSpacing: "0.25px" }}>
            {product
              ? `${product.name} bán chạy nhất tháng này`
              : "Đang tải..."}
          </Typography>
          <Typography variant="h5" sx={{ my: 4, color: "primary.main" }}>
            {formatCurrency(product?.revenue)}
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Xem doanh số
          </Button>
          <TriangleImg alt="tam giác" src={`/images/misc/${imageSrc}`} />
          <TrophyImg alt="cúp vàng" src="/images/misc/trophy.png" />
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isFullScreen}
        maxWidth="sm"
        fullWidth
        disableScrollLock={true}
      >
        <DialogTitle>
          Chi tiết doanh số
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {product && (
            <Stack spacing={3}>
              {/* Thông tin sản phẩm */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mã sản phẩm: {product.productId}
                </Typography>
              </Box>

              <Divider />

              {/* Số liệu tổng quan */}
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={3}
                flexWrap="wrap"
              >
                <Box>
                  <Typography variant="subtitle2">Tổng doanh thu</Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(product?.revenue)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">Số lượng bán</Typography>
                  <Typography variant="h6">
                    {product.quantitySold ?? 0}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">
                    Tăng trưởng doanh thu
                  </Typography>
                  <Typography
                    variant="h6"
                    color={
                      product.revenueGrowthRate >= 0
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {product.revenueGrowthRate >= 0 ? "↑" : "↓"}{" "}
                    {Math.abs(product.revenueGrowthRate)}%
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">
                    Tăng trưởng số lượng
                  </Typography>
                  <Typography
                    variant="h6"
                    color={
                      product.quantityGrowthRate >= 0
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {product.quantityGrowthRate >= 0 ? "↑" : "↓"}{" "}
                    {Math.abs(product.quantityGrowthRate)}%
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              {/* Biểu đồ & chế độ chọn */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  So sánh tháng này và tháng trước
                </Typography>

                <ButtonGroup sx={{ mb: 2 }}>
                  <Button
                    variant={chartMode === "revenue" ? "contained" : "outlined"}
                    onClick={() => setChartMode("revenue")}
                  >
                    Doanh thu
                  </Button>
                  <Button
                    variant={
                      chartMode === "quantity" ? "contained" : "outlined"
                    }
                    onClick={() => setChartMode("quantity")}
                  >
                    Số lượng bán
                  </Button>
                </ButtonGroup>

                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  height={320}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Trophy;
