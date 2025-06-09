"use client";

import { useState } from "react";
import {
  Grid,
  MenuItem,
  TextField,
  Typography,
  Card,
  Box,
} from "@mui/material";
import SalesChart from "@/components/dashboard/SalesChart";

interface StatusOption {
  value: string;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: "today", label: "Hôm nay" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm nay" },
];

const SaleReportCard = () => {
  const [value, setValue] = useState<string>("today");

  return (
    <Card sx={{ p: 3 }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid>
          <Typography variant="h6">Báo cáo doanh thu</Typography>
        </Grid>
        <Grid>
          <TextField
            id="select-report-range"
            select
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{
              minWidth: 120,
              "& .MuiInputBase-input": { py: 0.75, fontSize: "0.875rem" },
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <SalesChart filter={value} />
      </Box>
    </Card>
  );
};

export default SaleReportCard;
