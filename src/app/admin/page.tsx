"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
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

const DashboardPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <ApexChartWrapper>
      <Box display="flex" flexDirection="column" gap={6}>
        {/* Row 1: Trophy + StatisticsCard */}
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          gap={6}
        >
          <Box flex={3}>
            <Trophy />
          </Box>
          <Box flex={7}>
            <StatisticsCard />
          </Box>
        </Box>

        {/* Row 2: WeeklyOverview + TotalEarning + Vertical Cards */}
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          gap={6}
        >
          <Box flex={3}>
            <WeeklyOverview />
          </Box>
          <Box
            flex={7}
            display="flex"
            flexDirection={isSmallScreen ? "column" : "row"}
            gap={6}
          >
            <Box flex={3}>
              <TotalEarning />
            </Box>
            <Box flex={3}>
              <Box
                display="grid"
                gridTemplateColumns={isSmallScreen ? "1fr" : "repeat(2, 1fr)"}
                gap={6}
              >
                <CardStatisticsVerticalComponent
                  stats="$25.6k"
                  icon={<Poll />}
                  color="success"
                  trendNumber="+42%"
                  title="Total Profit"
                  subtitle="Weekly Profit"
                />
                <CardStatisticsVerticalComponent
                  stats="$78"
                  icon={<CurrencyUsd />}
                  trend="negative"
                  trendNumber="-15%"
                  color="secondary"
                  title="Refunds"
                  subtitle="Past Month"
                />
                <CardStatisticsVerticalComponent
                  stats="862"
                  icon={<BriefcaseVariantOutline />}
                  trend="negative"
                  trendNumber="-18%"
                  color="primary"
                  title="New Project"
                  subtitle="Yearly Project"
                />
                <CardStatisticsVerticalComponent
                  stats="15"
                  icon={<HelpCircleOutline />}
                  trend="negative"
                  trendNumber="-18%"
                  color="warning"
                  title="Sales Queries"
                  subtitle="Last Week"
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Row 3: Sales by Countries + DepositWithdraw */}
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          gap={6}
        >
          <Box flex={3}>
            <SalesByCountries />
          </Box>
          <Box flex={7}>
            <DepositWithdraw />
          </Box>
        </Box>

        {/* Row 4: DashboardTable full width */}
        <Box>
          <DashboardTable />
        </Box>
      </Box>
    </ApexChartWrapper>
  );
};

export default DashboardPage;
