"use client";

import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";

export interface DateRange {
  start: string; // yyyy-MM-dd
  end: string;   // yyyy-MM-dd (inclusive)
}

interface Props {
  onChange: (range: DateRange) => void;
}

type Preset = "today" | "7d" | "30d" | "thisMonth" | "thisYear" | "custom";

const presets: { key: Preset; label: string }[] = [
  { key: "today",     label: "Hôm nay" },
  { key: "7d",        label: "7 ngày" },
  { key: "30d",       label: "30 ngày" },
  { key: "thisMonth", label: "Tháng này" },
  { key: "thisYear",  label: "Năm nay" },
  { key: "custom",    label: "Tùy chỉnh" },
];

function buildRange(preset: Preset): DateRange {
  const today = dayjs();
  switch (preset) {
    case "today":     return { start: today.format("YYYY-MM-DD"), end: today.format("YYYY-MM-DD") };
    case "7d":        return { start: today.subtract(6, "day").format("YYYY-MM-DD"), end: today.format("YYYY-MM-DD") };
    case "30d":       return { start: today.subtract(29, "day").format("YYYY-MM-DD"), end: today.format("YYYY-MM-DD") };
    case "thisMonth": return { start: today.startOf("month").format("YYYY-MM-DD"), end: today.format("YYYY-MM-DD") };
    case "thisYear":  return { start: today.startOf("year").format("YYYY-MM-DD"), end: today.format("YYYY-MM-DD") };
    default:          return { start: today.subtract(6, "day").format("YYYY-MM-DD"), end: today.format("YYYY-MM-DD") };
  }
}

const DateRangeBar = ({ onChange }: Props) => {
  const [active, setActive] = useState<Preset>("7d");
  const [customStart, setCustomStart] = useState<Dayjs | null>(dayjs().subtract(6, "day"));
  const [customEnd,   setCustomEnd]   = useState<Dayjs | null>(dayjs());

  const handlePreset = (preset: Preset) => {
    setActive(preset);
    if (preset !== "custom") {
      onChange(buildRange(preset));
    }
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    const start = customStart.format("YYYY-MM-DD");
    const end   = customEnd.isAfter(customStart) ? customEnd.format("YYYY-MM-DD") : start;
    onChange({ start, end });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
            Khoảng thời gian:
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            {presets.map(({ key, label }) => (
              <Button
                key={key}
                variant={active === key ? "contained" : "outlined"}
                onClick={() => handlePreset(key)}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>

        <Collapse in={active === "custom"} unmountOnExit>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }} flexWrap="wrap">
            <DatePicker
              label="Từ ngày"
              value={customStart}
              onChange={setCustomStart}
              maxDate={customEnd ?? undefined}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="Đến ngày"
              value={customEnd}
              onChange={setCustomEnd}
              minDate={customStart ?? undefined}
              maxDate={dayjs()}
              slotProps={{ textField: { size: "small" } }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyCustom}
              disabled={!customStart || !customEnd}
            >
              Áp dụng
            </Button>
          </Stack>
        </Collapse>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangeBar;
