// src/@core/components/card-stats/CardStatsVertical.tsx
"use client";
import {
  Box,
  Card,
  Avatar,
  IconButton,
  Typography,
  CardContent,
  Menu,
  MenuItem,
} from "@mui/material";
import DotsVertical from "mdi-material-ui/DotsVertical";
import { ReactNode, useState } from "react";

type Period = "week" | "month" | "year";
type Trend = "positive" | "negative";

export interface CardStatsVerticalProps {
  icon: ReactNode;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  title: string;
  subtitle: string;
  stats: string;
  trend?: Trend;
  trendNumber: string;
  onPeriodChange?: (period: Period) => void;
}

export default function CardStatsVertical({
  icon,
  color = "primary",
  title,
  subtitle,
  stats,
  trend = "positive",
  trendNumber,
  onPeriodChange,
}: CardStatsVerticalProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSelect = (p: Period) => {
    setAnchorEl(null);
    onPeriodChange?.(p);
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            mb: 5.5,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Avatar
            sx={{
              boxShadow: 3,
              mr: 4,
              color: "common.white",
              bgcolor: `${color}.main`,
            }}
          >
            {icon}
          </Avatar>
          <IconButton
            size="small"
            aria-label="menu"
            sx={{ color: "text.secondary" }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <DotsVertical />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
            disableScrollLock
          >
            <MenuItem onClick={() => handleSelect("week")}>Tuần</MenuItem>
            <MenuItem onClick={() => handleSelect("month")}>Tháng</MenuItem>
            <MenuItem onClick={() => handleSelect("year")}>Năm</MenuItem>
          </Menu>
        </Box>

        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {title}
        </Typography>

        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            flexWrap: "wrap",
            mb: 1.5,
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6" sx={{ mr: 2 }}>
            {stats}
          </Typography>
          <Typography
            component="sup"
            variant="caption"
            sx={{ color: trend === "positive" ? "success.main" : "error.main" }}
          >
            {trendNumber}
          </Typography>
        </Box>

        <Typography variant="caption">{subtitle}</Typography>
      </CardContent>
    </Card>
  );
}
