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

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";

// ** Third Party Imports
import ApexOptions from "apexcharts";

// ** Custom Components Imports
import ReactApexcharts from "src/@core/components/react-apexcharts";

const WeeklyOverview = () => {
  const theme = useTheme();

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
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5,
      },
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.primary.main,
      theme.palette.background.default,
      theme.palette.background.default,
    ],
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    xaxis: {
      categories: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      tickPlacement: "on",
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -17,
        formatter: (value) =>
          `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`,
      },
    },
  };

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
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
            sx={{ color: "text.secondary" }}
          >
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent
        sx={{ "& .apexcharts-xcrosshairs.apexcharts-active": { opacity: 0 } }}
      >
        <ReactApexcharts
          type="bar"
          height={215}
          options={options}
          series={[{ data: [37, 57, 45, 75, 57, 40, 65] }]}
        />
        <Box sx={{ mb: 7, display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mr: 4 }}>
            45%
          </Typography>
          <Typography variant="body2">
            Hiệu suất bán hàng tăng 45% 😎 so với tháng trước
          </Typography>
        </Box>
        <Button fullWidth variant="contained">
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeeklyOverview;
