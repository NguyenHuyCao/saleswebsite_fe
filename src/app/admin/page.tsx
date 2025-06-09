"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ApexChartWrapper from "@/styles/libs/react-apexcharts";
import Trophy from "@/views/admin/dashboard/app.trophy";
import StatisticsCard from "@/views/admin/dashboard/app.statistics.card";
import WeeklyOverview from "@/views/admin/dashboard/app.weekly.overview";
import TotalEarning from "@/views/admin/dashboard/app.total.earning";
import SalesByCountries from "@/views/admin/dashboard/app.sales.countries";
import DepositWithdraw from "@/views/admin/dashboard/app.deposit.draw";
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

const DashboardPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  console.log(isSmallScreen);

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
                    stats="$25.6k"
                    icon={<Poll />}
                    color="success"
                    trendNumber="+42%"
                    title="Tổng lợi nhuận"
                    subtitle="Lợi nhuận trong tuần"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CardStatisticsVerticalComponent
                    stats="$78"
                    icon={<CurrencyUsd />}
                    trend="negative"
                    trendNumber="-15%"
                    color="secondary"
                    title="Hoàn tiền"
                    subtitle="Tháng trước"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CardStatisticsVerticalComponent
                    stats="862"
                    icon={<BriefcaseVariantOutline />}
                    trend="negative"
                    trendNumber="-18%"
                    color="primary"
                    title="Dự án mới"
                    subtitle="Dự án trong năm"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CardStatisticsVerticalComponent
                    stats="15"
                    icon={<HelpCircleOutline />}
                    trend="negative"
                    trendNumber="-18%"
                    color="warning"
                    title="Truy vấn bán hàng"
                    subtitle="Tuần trước"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Row 3 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <SalesByCountries />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <DepositWithdraw />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <UserRatingPage />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <IncomeAreaChart view="monthly" />
        </Grid>

        {/* <Grid size={{ xs: 12 }}>
          <IncomeAreaChart view="monthly" />
        </Grid> */}

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
