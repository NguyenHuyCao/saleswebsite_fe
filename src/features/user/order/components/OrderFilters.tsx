// order/components/OrderFilters.tsx
"use client";

import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Chip,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
import { useState } from "react";
import { Dayjs } from "dayjs";

interface OrderFiltersProps {
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: { start: Dayjs | null; end: Dayjs | null };
  onDateRangeChange: (range: {
    start: Dayjs | null;
    end: Dayjs | null;
  }) => void;
}

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "WAITING_PAYMENT", label: "Chờ thanh toán" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPING", label: "Đang vận chuyển" },
  { value: "DELIVERED", label: "Đã nhận hàng" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function OrderFilters({
  filterStatus,
  onFilterStatusChange,
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: OrderFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          {/* Search and Filter Toggle */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo mã đơn hàng..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#999" }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => onSearchChange("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                bgcolor: showFilters ? "#f25c05" : "transparent",
                color: showFilters ? "#fff" : "#666",
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Stack>

          {/* Advanced Filters */}
          {showFilters && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filterStatus}
                  label="Trạng thái"
                  onChange={(e) => onFilterStatusChange(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label="Từ ngày"
                value={dateRange.start}
                onChange={(date) =>
                  onDateRangeChange({ ...dateRange, start: date })
                }
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />

              <DatePicker
                label="Đến ngày"
                value={dateRange.end}
                onChange={(date) =>
                  onDateRangeChange({ ...dateRange, end: date })
                }
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />

              {(filterStatus !== "all" ||
                searchTerm ||
                dateRange.start ||
                dateRange.end) && (
                <Chip
                  label="Xóa bộ lọc"
                  onClick={() => {
                    onFilterStatusChange("all");
                    onSearchChange("");
                    onDateRangeChange({ start: null, end: null });
                  }}
                  color="warning"
                />
              )}
            </Stack>
          )}
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
}
