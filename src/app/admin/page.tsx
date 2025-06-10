"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ApexChartWrapper from "@/styles/libs/react-apexcharts";
import Trophy from "@/views/admin/dashboard/app.trophy";
import StatisticsCard from "@/views/admin/dashboard/app.statistics.card";
import WeeklyOverview from "@/views/admin/dashboard/app.weekly.overview";
import TotalEarning from "@/views/admin/dashboard/app.total.earning";
import DashboardTable from "@/views/admin/dashboard/app.table";

import CardStatisticsVerticalComponent from "src/@core/components/card-statistics/card-stats-vertical";
import {
  Poll,
  CurrencyUsd,
  BriefcaseVariantOutline,
  HelpCircleOutline,
} from "mdi-material-ui";
import { Grid } from "@mui/material";
import IncomeAreaChart from "@/views/admin/dashboard/app.incom.area.chart";
import OrderTable from "@/views/admin/dashboard/app.order.table";
import ReportAreaChart from "@/views/admin/dashboard/app.report.area.chart";
import SaleReportCard from "@/views/admin/dashboard/app.sale.report.card";
import TransactionHistoryCard from "@/views/admin/dashboard/app.transaction.history.card";
import UserRatingPage from "@/views/admin/dashboard/app.user.rating";
import { useEffect, useState } from "react";
import SalesByCategories from "@/views/admin/dashboard/app.sales.category";
import TopSellingAndLowRevenue from "@/views/admin/dashboard/app.top.salling.and.low.revenue";

const DashboardPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [profit, setProfit] = useState<any>(null);
  const [refund, setRefund] = useState<any>(null);
  const [visitor, setVisitor] = useState<any>(null);
  const [sales, setSales] = useState<any>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchData = async () => {
      const fetchFrom = async (url: string) => {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
      };

      const [profitData, refundData, visitorData, salesData] =
        await Promise.all([
          fetchFrom(
            "http://localhost:8080/api/v1/dashboard/overview/profit-summary"
          ),
          fetchFrom(
            "http://localhost:8080/api/v1/dashboard/overview/total-refund"
          ),
          fetchFrom(
            "http://localhost:8080/api/v1/dashboard/overview/visitor-statistics"
          ),
          fetchFrom(
            "http://localhost:8080/api/v1/dashboard/overview/sales-statistics"
          ),
        ]);

      if (profitData.status === 200) setProfit(profitData.data);
      if (refundData.status === 200) setRefund(refundData.data);
      if (visitorData.status === 200) setVisitor(visitorData.data);
      if (salesData.status === 200) setSales(salesData.data);
    };

    fetchData();
  }, []);

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {/* Row 1 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Trophy />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <StatisticsCard />
        </Grid>

        {/* Row 2 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <WeeklyOverview />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TotalEarning />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CardStatisticsVerticalComponent
                    stats={`${(
                      profit?.[selectedPeriod]?.current || 0
                    ).toLocaleString("vi-VN")} ₫`}
                    icon={<Poll />}
                    color="success"
                    trendNumber={`${Math.abs(
                      profit?.[selectedPeriod]?.growth || 0
                    ).toFixed(2)}%`}
                    trend={
                      (profit?.[selectedPeriod]?.growth || 0) >= 0
                        ? "positive"
                        : "negative"
                    }
                    title="Tổng lợi nhuận"
                    subtitle={`Lợi nhuận trong ${selectedPeriod}`}
                    onPeriodChange={setSelectedPeriod}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CardStatisticsVerticalComponent
                    stats={`${(
                      refund?.[selectedPeriod]?.current || 0
                    ).toLocaleString("vi-VN")} ₫`}
                    icon={<CurrencyUsd />}
                    color="secondary"
                    trendNumber=""
                    trend="negative"
                    title="Hoàn tiền"
                    subtitle={`Tổng hoàn tiền trong ${selectedPeriod}`}
                    onPeriodChange={setSelectedPeriod}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CardStatisticsVerticalComponent
                    stats={`${(
                      visitor?.[selectedPeriod]?.this || 0
                    ).toLocaleString("vi-VN")}`}
                    icon={<BriefcaseVariantOutline />}
                    trend="positive"
                    trendNumber={`${
                      visitor?.[selectedPeriod]?.performance?.toFixed(2) ||
                      "0.00"
                    }%`}
                    color="primary"
                    title="Lượt truy cập"
                    subtitle={`So với kỳ trước (${selectedPeriod})`}
                    onPeriodChange={setSelectedPeriod}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CardStatisticsVerticalComponent
                    stats={`${(
                      sales?.[selectedPeriod]?.this || 0
                    ).toLocaleString("vi-VN")} ₫`}
                    icon={<HelpCircleOutline />}
                    trend={
                      (sales?.[selectedPeriod]?.performance || 0) >= 0
                        ? "positive"
                        : "negative"
                    }
                    trendNumber={`${Math.abs(
                      sales?.[selectedPeriod]?.performance || 0
                    ).toFixed(2)}%`}
                    color="warning"
                    title="Doanh thu"
                    subtitle={`So với kỳ trước (${selectedPeriod})`}
                    onPeriodChange={setSelectedPeriod}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Row 3 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <SalesByCategories />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <TopSellingAndLowRevenue />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <UserRatingPage />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <IncomeAreaChart />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ReportAreaChart />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <OrderTable />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TransactionHistoryCard />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <SaleReportCard />
        </Grid>

        {/* Row 6 */}
        <Grid size={{ xs: 12 }}>
          <DashboardTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default DashboardPage;
