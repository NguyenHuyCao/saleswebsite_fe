"use client";

import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { useState } from "react";

export default function ShippingMethod() {
  const [method, setMethod] = useState("");

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mt: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight="bold">
            Vận chuyển
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography color="text.secondary">
            Vui lòng nhập địa chỉ để tính phí vận chuyển
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <RadioGroup
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <FormControlLabel
              value="standard"
              control={<Radio />}
              label="Giao tiêu chuẩn: 0đ – Nhận sau 3–5 ngày"
            />
            <FormControlLabel
              value="express"
              control={<Radio />}
              label="Giao nhanh: +30.000đ – Nhận sau 1–2 ngày"
            />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}
