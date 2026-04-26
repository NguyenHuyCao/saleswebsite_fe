"use client";

import {
  Box,
  TextField,
  InputAdornment,
  Stack,
  Paper,
  IconButton,
  Collapse,
  Button,
  Tab,
  Tabs,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState, SyntheticEvent } from "react";
import type { Dayjs } from "dayjs";
import { useMyOrdersQuery } from "../queries";

interface OrderFiltersProps {
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: { start: Dayjs | null; end: Dayjs | null };
  onDateRangeChange: (range: { start: Dayjs | null; end: Dayjs | null }) => void;
}

const STATUS_TABS = [
  { value: "all",             label: "Tất cả"          },
  { value: "PENDING",         label: "Chờ xác nhận"    },
  { value: "WAITING_PAYMENT", label: "Chờ thanh toán"  },
  { value: "CONFIRMED",       label: "Đã xác nhận"     },
  { value: "SHIPPING",        label: "Đang giao"        },
  { value: "DELIVERED",       label: "Đã nhận hàng"    },
  { value: "CANCELLED",       label: "Đã hủy"          },
];

export default function OrderFilters({
  filterStatus,
  onFilterStatusChange,
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: OrderFiltersProps) {
  const [showDate, setShowDate] = useState(false);
  const { data: orders = [] } = useMyOrdersQuery();

  // Count per status (cached — no extra network request)
  const counts = STATUS_TABS.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] =
      tab.value === "all"
        ? orders.length
        : orders.filter((o) => o.status === tab.value).length;
    return acc;
  }, {});

  const hasDateFilter = !!(dateRange.start || dateRange.end);

  const handleTabChange = (_: SyntheticEvent, value: string) => {
    onFilterStatusChange(value);
  };

  const clearAll = () => {
    onFilterStatusChange("all");
    onSearchChange("");
    onDateRangeChange({ start: null, end: null });
    setShowDate(false);
  };

  const hasAnyFilter =
    filterStatus !== "all" || searchTerm || hasDateFilter;

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: 3, border: "1px solid #f0f0f0", mb: 3, overflow: "hidden" }}
    >
      {/* ── Status tabs ────────────────────────────────────────── */}
      <Tabs
        value={filterStatus}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        TabIndicatorProps={{ style: { backgroundColor: "#f25c05", height: 3 } }}
        sx={{
          borderBottom: "1px solid #f0f0f0",
          bgcolor: "#fff",
          minHeight: 48,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: { xs: "0.78rem", sm: "0.85rem" },
            minHeight: 48,
            color: "#666",
            px: { xs: 1.5, sm: 2 },
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#f25c05",
            fontWeight: 700,
          },
        }}
      >
        {STATUS_TABS.map((tab) => {
          const count = counts[tab.value] ?? 0;
          const isSelected = filterStatus === tab.value;
          return (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Stack direction="row" alignItems="center" spacing={0.6}>
                  <span>{tab.label}</span>
                  <Box
                    component="span"
                    sx={{
                      bgcolor: isSelected ? "#f25c05" : "#bdbdbd",
                      color: "#fff",
                      borderRadius: "10px",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 0.5,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {count > 99 ? "99+" : count}
                  </Box>
                </Stack>
              }
            />
          );
        })}
      </Tabs>

      {/* ── Search + date toggle ────────────────────────────────── */}
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo mã đơn hàng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#bbb", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => onSearchChange("")}>
                      <ClearIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* Date range toggle */}
          <IconButton
            onClick={() => setShowDate((v) => !v)}
            sx={{
              border: "1px solid",
              borderColor: showDate || hasDateFilter ? "#f25c05" : "#e0e0e0",
              borderRadius: 2,
              color: showDate || hasDateFilter ? "#f25c05" : "#666",
              bgcolor: showDate || hasDateFilter ? "#fff3e0" : "transparent",
              flexShrink: 0,
              width: 40,
              height: 40,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Clear all — only when any filter active */}
          {hasAnyFilter && (
            <Button
              size="small"
              variant="text"
              onClick={clearAll}
              sx={{
                textTransform: "none",
                color: "#f25c05",
                fontWeight: 600,
                whiteSpace: "nowrap",
                flexShrink: 0,
                fontSize: "0.78rem",
              }}
            >
              Xóa lọc
            </Button>
          )}
        </Stack>

        {/* ── Date range pickers ──────────────────────────────── */}
        <Collapse in={showDate}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 1.5 }}
          >
            <DatePicker
              label="Từ ngày"
              value={dateRange.start}
              onChange={(d) => onDateRangeChange({ ...dateRange, start: d })}
              maxDate={dateRange.end ?? undefined}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: { bgcolor: "#fafafa" },
                },
              }}
            />
            <DatePicker
              label="Đến ngày"
              value={dateRange.end}
              onChange={(d) => onDateRangeChange({ ...dateRange, end: d })}
              minDate={dateRange.start ?? undefined}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: { bgcolor: "#fafafa" },
                },
              }}
            />
            {hasDateFilter && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  onDateRangeChange({ start: null, end: null });
                }}
                sx={{
                  textTransform: "none",
                  borderColor: "#f25c05",
                  color: "#f25c05",
                  whiteSpace: "nowrap",
                  alignSelf: { xs: "flex-start", sm: "center" },
                }}
              >
                Xóa ngày
              </Button>
            )}
          </Stack>
        </Collapse>
      </Box>
    </Paper>
  );
}
