"use client";

// ** React Imports
import { ReactElement } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";

// ** Icons Imports
import TrendingUp from "mdi-material-ui/TrendingUp";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import DotsVertical from "mdi-material-ui/DotsVertical";
import CellphoneLink from "mdi-material-ui/CellphoneLink";
import AccountOutline from "mdi-material-ui/AccountOutline";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

interface DataType {
  stats: string;
  title: string;
  color: ThemeColor;
  icon: ReactElement;
}

// Thống kê tùy chỉnh theo website bán máy 2 thì
const salesData: DataType[] = [
  {
    stats: "245k",
    title: "Đơn hàng",
    color: "primary",
    icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "12.5k",
    title: "Khách hàng",
    color: "success",
    icon: <AccountOutline sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "1.54k",
    title: "Sản phẩm 2 thì",
    color: "warning",
    icon: <CellphoneLink sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "2.1 tỷ ₫",
    title: "Doanh thu",
    color: "info",
    icon: <CurrencyUsd sx={{ fontSize: "1.75rem" }} />,
  },
];

const renderStats = () => {
  return salesData.map((item: DataType, index: number) => (
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
            backgroundColor: `${item.color}.main`,
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption">{item.title}</Typography>
          <Typography variant="h6">{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ));
};

const StatisticsCard = () => {
  return (
    <Card
      sx={{
        minHeight: 210,
        px: 4,
        pb: 4,
        "& .MuiCardContent-root": {
          pt: 0,
          px: 2,
        },
        "& .MuiGrid2-root": {
          columnGap: 4,
          rowGap: 3,
        },
        "& .MuiAvatar-root": {
          width: 50,
          height: 50,
        },
        "& .MuiTypography-h6": {
          fontSize: "1.25rem",
        },
        "& .MuiTypography-caption": {
          fontSize: "0.875rem",
          color: "text.secondary",
        },
      }}
    >
      <CardHeader
        title="Thống kê tổng quan"
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
        subheader={
          <Typography variant="body2">
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Tăng trưởng 48.5%
            </Box>{" "}
            trong tháng này 🚀
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
      <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={3}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
