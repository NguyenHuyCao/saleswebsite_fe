"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid, Box } from "@mui/material";
import ApexChartWrapper from "@/styles/libs/react-apexcharts";
import Trophy from "@/views/dashboard/app.trophy";
import StatisticsCard from "@/views/dashboard/app.statistics.card";
import WeeklyOverview from "@/views/dashboard/app.weekly.overview";
import TotalEarning from "@/views/dashboard/app.total.earning";
import DashboardTable from "@/views/dashboard/app.table";
import CardStatisticsVerticalComponent from "src/@core/components/card-statistics/card-stats-vertical";
import {
  Poll,
  CurrencyUsd,
  BriefcaseVariantOutline,
  HelpCircleOutline,
} from "mdi-material-ui";
import IncomeAreaChart from "@/views/dashboard/app.incom.area.chart";
import OrderTable from "@/views/dashboard/app.order.table";
import ReportAreaChart from "@/views/dashboard/app.report.area.chart";
import SaleReportCard from "@/views/dashboard/app.sale.report.card";
import TransactionHistoryCard from "@/views/dashboard/app.transaction.history.card";
import UserRatingPage from "@/views/dashboard/app.user.rating";
import SalesByCategories from "@/views/dashboard/app.sales.category";
import TopSellingAndLowRevenue from "@/views/dashboard/app.top.salling.and.low.revenue";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@/redux/store";
import { setScrollTrigger } from "@/redux/slices/searchSlice";

// ✅ dùng http/api custom
import { api } from "@/lib/api/http";

/* ------------ Types cho payload ------------- */
type Period = "week" | "month" | "year";

type SummaryByPeriod<T> = {
  week: T;
  month: T;
  year: T;
};

type ProfitItem = { current: number; growth: number };
type RefundItem = { current: number };
type VisitorItem = { this: number; performance: number };
type SalesItem = { this: number; performance: number };

const DashboardPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );
  const scrollTrigger = useSelector(
    (state: AppState) => state.search.scrollTrigger
  );

  const [profit, setProfit] = useState<SummaryByPeriod<ProfitItem> | null>(
    null
  );
  const [refund, setRefund] = useState<SummaryByPeriod<RefundItem> | null>(
    null
  );
  const [visitor, setVisitor] = useState<SummaryByPeriod<VisitorItem> | null>(
    null
  );
  const [sales, setSales] = useState<SummaryByPeriod<SalesItem> | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    "Tổng lợi nhuận": useRef<HTMLDivElement | null>(null),
    "Doanh thu": useRef<HTMLDivElement | null>(null),
    "Lượt truy cập": useRef<HTMLDivElement | null>(null),
    "Hoàn tiền": useRef<HTMLDivElement | null>(null),
    "Báo cáo thu nhập": useRef<HTMLDivElement | null>(null),
    "Báo cáo": useRef<HTMLDivElement | null>(null),
    "Đơn hàng": useRef<HTMLDivElement | null>(null),
    "Lịch sử giao dịch": useRef<HTMLDivElement | null>(null),
    "Sản phẩm bán chạy": useRef<HTMLDivElement | null>(null),
    "Đánh giá người dùng": useRef<HTMLDivElement | null>(null),
  };

  useEffect(() => {
    if (!keyword || !scrollTrigger) return;
    const closestMatch = Object.keys(sectionRefs).find((title) =>
      title.toLowerCase().includes(keyword)
    );
    const ref = closestMatch ? sectionRefs[closestMatch] : null;
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    dispatch(setScrollTrigger(false));
  }, [keyword, scrollTrigger, dispatch]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const [profitData, refundData, visitorData, salesData] =
          await Promise.all([
            api.get<SummaryByPeriod<ProfitItem>>(
              "/api/v1/dashboard/overview/profit-summary",
              { signal: controller.signal }
            ),
            api.get<SummaryByPeriod<RefundItem>>(
              "/api/v1/dashboard/overview/total-refund",
              { signal: controller.signal }
            ),
            api.get<SummaryByPeriod<VisitorItem>>(
              "/api/v1/dashboard/overview/visitor-statistics",
              { signal: controller.signal }
            ),
            api.get<SummaryByPeriod<SalesItem>>(
              "/api/v1/dashboard/overview/sales-statistics",
              { signal: controller.signal }
            ),
          ]);

        setProfit(profitData);
        setRefund(refundData);
        setVisitor(visitorData);
        setSales(salesData);
      } catch (error) {
        // Fail-soft để không vỡ trang; http.ts đã ném Error có message rõ ràng
        console.error("Fetch dashboard data error:", error);
        setProfit(null);
        setRefund(null);
        setVisitor(null);
        setSales(null);
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Trophy />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <StatisticsCard />
        </Grid>
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
                  <Box ref={sectionRefs["Tổng lợi nhuận"]}>
                    <CardStatisticsVerticalComponent
                      stats={`${(
                        profit?.[selectedPeriod]?.current || 0
                      ).toLocaleString("vi-VN")}`}
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
                      subtitle="Tổng lợi nhuận trong kỳ"
                      onPeriodChange={setSelectedPeriod}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box ref={sectionRefs["Hoàn tiền"]}>
                    <CardStatisticsVerticalComponent
                      stats={`${(
                        refund?.[selectedPeriod]?.current || 0
                      ).toLocaleString("vi-VN")}`}
                      icon={<CurrencyUsd />}
                      color="secondary"
                      trend="negative"
                      trendNumber=""
                      title="Hoàn tiền"
                      subtitle="Tổng hoàn tiền trong kỳ"
                      onPeriodChange={setSelectedPeriod}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box ref={sectionRefs["Lượt truy cập"]}>
                    <CardStatisticsVerticalComponent
                      stats={`${(
                        visitor?.[selectedPeriod]?.this || 0
                      ).toLocaleString("vi-VN")}`}
                      icon={<BriefcaseVariantOutline />}
                      color="primary"
                      trend="positive"
                      trendNumber={`${
                        visitor?.[selectedPeriod]?.performance?.toFixed(2) ||
                        "0.00"
                      }%`}
                      title="Lượt truy cập"
                      subtitle="So với kỳ trước"
                      onPeriodChange={setSelectedPeriod}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box ref={sectionRefs["Doanh thu"]}>
                    <CardStatisticsVerticalComponent
                      stats={`${(
                        sales?.[selectedPeriod]?.this || 0
                      ).toLocaleString("vi-VN")}`}
                      icon={<HelpCircleOutline />}
                      color="warning"
                      trend={
                        (sales?.[selectedPeriod]?.performance || 0) >= 0
                          ? "positive"
                          : "negative"
                      }
                      trendNumber={`${Math.abs(
                        sales?.[selectedPeriod]?.performance || 0
                      ).toFixed(2)}%`}
                      title="Doanh thu"
                      subtitle="So với kỳ trước"
                      onPeriodChange={setSelectedPeriod}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box ref={sectionRefs["Sản phẩm bán chạy"]}>
            <SalesByCategories />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <TopSellingAndLowRevenue />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box ref={sectionRefs["Đánh giá người dùng"]}>
            <UserRatingPage />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box ref={sectionRefs["Báo cáo thu nhập"]}>
            <IncomeAreaChart />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box ref={sectionRefs["Báo cáo"]}>
            <ReportAreaChart />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box ref={sectionRefs["Đơn hàng"]}>
            <OrderTable />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box ref={sectionRefs["Lịch sử giao dịch"]}>
            <TransactionHistoryCard />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <SaleReportCard />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <DashboardTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default DashboardPage;
