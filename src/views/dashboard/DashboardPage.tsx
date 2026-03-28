"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Badge, Box, Grid, IconButton, Tooltip } from "@mui/material";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
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
  TrendingUp,
} from "mdi-material-ui";
import IncomeAreaChart from "@/views/dashboard/app.incom.area.chart";
import OrderTable from "@/views/dashboard/app.order.table";
import ReportAreaChart from "@/views/dashboard/app.report.area.chart";
import SaleReportCard from "@/views/dashboard/app.sale.report.card";
import TransactionHistoryCard from "@/views/dashboard/app.transaction.history.card";
import UserRatingPage from "@/views/dashboard/app.user.rating";
import SalesByCategories from "@/views/dashboard/app.sales.category";
import TopSellingAndLowRevenue from "@/views/dashboard/app.top.salling.and.low.revenue";
import SupportDrawer from "@/views/dashboard/support/SupportDrawer";
import DateRangeBar, { DateRange } from "@/views/dashboard/app.date.range.bar";
import LowStockAlert from "@/views/dashboard/app.low.stock.alert";
import { useSocket } from "@/lib/socket/SocketContext";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@/redux/store";
import { setScrollTrigger } from "@/redux/slices/searchSlice";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";
import dayjs from "dayjs";

/* ------------ Types ------------- */
interface RangeSummary {
  startDate: string;
  endDate: string;
  orders: number;
  ordersGrowth: number;
  revenue: number;
  revenueGrowth: number;
  profit: number;
  profitGrowth: number;
  refund: number;
  refundGrowth: number;
  visitors: number;
  visitorsGrowth: number;
  conversionRate: number;
  convRateGrowth: number;
}

const DEFAULT_RANGE: DateRange = {
  start: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD"),
};

/* ------------------------------------------------------------------ */
const DashboardPage = () => {
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  /* ── Support drawer ── */
  const [supportOpen, setSupportOpen] = useState(false);
  const [pendingSupportCount, setPendingSupportCount] = useState(0);
  const { notifications, unreadSupportMsgCount, clearSupportUnread } = useSocket();
  const supportBadgeCount = pendingSupportCount + unreadSupportMsgCount;

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await api.get<{ count: number }>("/api/v1/admin/support/pending-count");
      setPendingSupportCount(res?.count ?? 0);
    } catch {}
  }, []);

  useEffect(() => { fetchPendingCount(); }, [fetchPendingCount]);

  useEffect(() => {
    const hasSupport = notifications.some(
      (n) => (n.type === "SUPPORT_ESCALATED" || n.type === "SUPPORT_RESOLVED") && !n.read
    );
    if (hasSupport) fetchPendingCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const handleOpenSupport = () => {
    setSupportOpen(true);
    clearSupportUnread();
  };

  /* ── Search scroll ── */
  const dispatch = useDispatch();
  const keyword = useSelector((state: AppState) => state.search.keyword.trim().toLowerCase());
  const scrollTrigger = useSelector((state: AppState) => state.search.scrollTrigger);

  /* ── Range summary ── */
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_RANGE);
  const [rangeData, setRangeData] = useState<RangeSummary | null>(null);

  const fetchRangeSummary = useCallback(async (range: DateRange) => {
    try {
      const data = await api.get<RangeSummary>(
        `/api/v1/dashboard/overview/range-summary?start=${range.start}&end=${range.end}`
      );
      setRangeData(data);
    } catch (error) {
      logIfNotCanceled(error, "fetchRangeSummary error:");
    }
  }, []);

  useEffect(() => { fetchRangeSummary(dateRange); }, [dateRange, fetchRangeSummary]);

  /* ── Section refs (Rules of Hooks — all top-level) ── */
  const refTotalProfit  = useRef<HTMLDivElement | null>(null);
  const refRevenue      = useRef<HTMLDivElement | null>(null);
  const refVisitor      = useRef<HTMLDivElement | null>(null);
  const refRefund       = useRef<HTMLDivElement | null>(null);
  const refConvRate     = useRef<HTMLDivElement | null>(null);
  const refIncomeChart  = useRef<HTMLDivElement | null>(null);
  const refReportChart  = useRef<HTMLDivElement | null>(null);
  const refOrders       = useRef<HTMLDivElement | null>(null);
  const refTransactions = useRef<HTMLDivElement | null>(null);
  const refTopSelling   = useRef<HTMLDivElement | null>(null);
  const refUserRating   = useRef<HTMLDivElement | null>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    "Tổng lợi nhuận":      refTotalProfit,
    "Doanh thu":           refRevenue,
    "Lượt truy cập":       refVisitor,
    "Hoàn tiền":           refRefund,
    "Tỷ lệ chuyển đổi":   refConvRate,
    "Báo cáo thu nhập":    refIncomeChart,
    "Báo cáo":             refReportChart,
    "Đơn hàng":            refOrders,
    "Lịch sử giao dịch":   refTransactions,
    "Sản phẩm bán chạy":   refTopSelling,
    "Đánh giá người dùng": refUserRating,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, scrollTrigger, dispatch]);

  /* ---------------------------------------------------------------- */
  return (
    <ApexChartWrapper>
      {/* ── Low stock alert ── */}
      <LowStockAlert />

      <Grid container spacing={6}>
        {/* ── Row 1: Trophy + Statistics ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Trophy />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <StatisticsCard />
        </Grid>

        {/* ── Row 2: WeeklyOverview + TotalEarning ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <WeeklyOverview />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <TotalEarning />
        </Grid>

        {/* ── Row 3: DateRangeBar — full width ── */}
        <Grid size={{ xs: 12 }}>
          <DateRangeBar onChange={setDateRange} />
        </Grid>

        {/* ── Row 4: 5 stat cards — 5 equal columns on desktop ──
              columns={10}: xs→1/row, sm→2/row, md→5/row           */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={3} columns={{ xs: 2, sm: 4, md: 10 }}>
            <Grid size={{ xs: 2, sm: 2, md: 2 }}>
              <Box ref={refTotalProfit}>
                <CardStatisticsVerticalComponent
                  stats={(rangeData?.profit ?? 0).toLocaleString("vi-VN")}
                  icon={<Poll />}
                  color="success"
                  trendNumber={`${Math.abs(rangeData?.profitGrowth ?? 0).toFixed(2)}%`}
                  trend={(rangeData?.profitGrowth ?? 0) >= 0 ? "positive" : "negative"}
                  title="Tổng lợi nhuận"
                  subtitle="Kỳ so sánh trước"
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 2, sm: 2, md: 2 }}>
              <Box ref={refRefund}>
                <CardStatisticsVerticalComponent
                  stats={(rangeData?.refund ?? 0).toLocaleString("vi-VN")}
                  icon={<CurrencyUsd />}
                  color="secondary"
                  trendNumber={`${Math.abs(rangeData?.refundGrowth ?? 0).toFixed(2)}%`}
                  trend={(rangeData?.refundGrowth ?? 0) <= 0 ? "positive" : "negative"}
                  title="Hoàn tiền"
                  subtitle="Tổng hoàn tiền trong kỳ"
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 2, sm: 2, md: 2 }}>
              <Box ref={refVisitor}>
                <CardStatisticsVerticalComponent
                  stats={(rangeData?.visitors ?? 0).toLocaleString("vi-VN")}
                  icon={<BriefcaseVariantOutline />}
                  color="primary"
                  trendNumber={`${Math.abs(rangeData?.visitorsGrowth ?? 0).toFixed(2)}%`}
                  trend={(rangeData?.visitorsGrowth ?? 0) >= 0 ? "positive" : "negative"}
                  title="Lượt truy cập"
                  subtitle="So với kỳ trước"
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 2, sm: 2, md: 2 }}>
              <Box ref={refRevenue}>
                <CardStatisticsVerticalComponent
                  stats={(rangeData?.revenue ?? 0).toLocaleString("vi-VN")}
                  icon={<HelpCircleOutline />}
                  color="warning"
                  trendNumber={`${Math.abs(rangeData?.revenueGrowth ?? 0).toFixed(2)}%`}
                  trend={(rangeData?.revenueGrowth ?? 0) >= 0 ? "positive" : "negative"}
                  title="Doanh thu"
                  subtitle="So với kỳ trước"
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 2, sm: 2, md: 2 }}>
              <Box ref={refConvRate}>
                <CardStatisticsVerticalComponent
                  stats={`${(rangeData?.conversionRate ?? 0).toFixed(2)}%`}
                  icon={<TrendingUp />}
                  color="info"
                  trendNumber={`${Math.abs(rangeData?.convRateGrowth ?? 0).toFixed(2)}%`}
                  trend={(rangeData?.convRateGrowth ?? 0) >= 0 ? "positive" : "negative"}
                  title="Tỷ lệ chuyển đổi"
                  subtitle="Khách → Đơn hàng"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* ── Row 5: SalesByCategories + TopSelling ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box ref={refTopSelling}>
            <SalesByCategories />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <TopSellingAndLowRevenue />
        </Grid>

        {/* ── Row 6: UserRating + IncomeChart ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box ref={refUserRating}>
            <UserRatingPage />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box ref={refIncomeChart}>
            <IncomeAreaChart />
          </Box>
        </Grid>

        {/* ── Row 7: ReportChart + OrderTable ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box ref={refReportChart}>
            <ReportAreaChart />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box ref={refOrders}>
            <OrderTable />
          </Box>
        </Grid>

        {/* ── Row 8: TransactionHistory + SaleReport ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box ref={refTransactions}>
            <TransactionHistoryCard
              onOpenSupport={handleOpenSupport}
              pendingSupportCount={supportBadgeCount}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <SaleReportCard />
        </Grid>

        {/* ── Row 9: Full-width user table ── */}
        <Grid size={{ xs: 12 }}>
          <DashboardTable />
        </Grid>
      </Grid>

      {/* ── Support FAB ── */}
      <Tooltip title="Hỗ trợ & Trò chuyện" placement="left">
        <Box sx={{ position: "fixed", bottom: 88, right: 24, zIndex: 1200 }}>
          <Badge badgeContent={supportBadgeCount} color="error" overlap="circular">
            <IconButton
              onClick={handleOpenSupport}
              sx={{
                width: 48,
                height: 48,
                bgcolor: "primary.main",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <HeadsetMicIcon />
            </IconButton>
          </Badge>
        </Box>
      </Tooltip>

      <SupportDrawer
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        onCountChange={fetchPendingCount}
      />
    </ApexChartWrapper>
  );
};

export default DashboardPage;
