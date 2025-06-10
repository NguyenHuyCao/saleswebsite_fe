// components/CardStatsVerticalComponent.tsx
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

interface CardStatsVerticalProps {
  icon: ReactNode;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  title: string;
  subtitle: string;
  stats: string;
  trend: "positive" | "negative";
  trendNumber: string;
  onPeriodChange?: (period: "week" | "month" | "year") => void;
}

const CardStatsVerticalComponent = ({
  icon,
  color = "primary",
  title,
  subtitle,
  stats,
  trend = "positive",
  trendNumber,
  onPeriodChange,
}: CardStatsVerticalProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (period: "week" | "month" | "year") => {
    handleMenuClose();
    onPeriodChange?.(period);
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            marginBottom: 5.5,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Avatar
            sx={{
              boxShadow: 3,
              marginRight: 4,
              color: "common.white",
              backgroundColor: `${color}.main`,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <IconButton
              size="small"
              aria-label="menu"
              sx={{ color: "text.secondary" }}
              onClick={handleMenuOpen}
            >
              <DotsVertical />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              disableScrollLock={true}
            >
              <MenuItem onClick={() => handleSelect("week")}>Tuần</MenuItem>
              <MenuItem onClick={() => handleSelect("month")}>Tháng</MenuItem>
              <MenuItem onClick={() => handleSelect("year")}>Năm</MenuItem>
            </Menu>
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {title}
        </Typography>
        <Box
          sx={{
            marginTop: 1.5,
            display: "flex",
            flexWrap: "wrap",
            marginBottom: 1.5,
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
};

export default CardStatsVerticalComponent;
