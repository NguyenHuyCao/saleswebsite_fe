"use client";

import { TextField, MenuItem, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import type { ShippingFormValue } from "../types";

const provinces = ["Hà Nội", "TP.HCM", "Đà Nẵng"];

export default function ShippingForm({
  value,
  onChange,
}: {
  value: ShippingFormValue;
  onChange: (next: ShippingFormValue) => void;
}) {
  const set = (field: keyof ShippingFormValue, v: string) =>
    onChange({ ...value, [field]: v });

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Thông tin nhận hàng
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
            error={!value.email}
            helperText={!value.email && "Vui lòng nhập email"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Họ và tên"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            error={!value.name}
            helperText={!value.name && "Vui lòng nhập họ tên"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Số điện thoại"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Địa chỉ cụ thể"
            value={value.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            required
            fullWidth
            label="Tỉnh/Thành"
            value={value.province}
            onChange={(e) => set("province", e.target.value)}
            error={!value.province}
            helperText={!value.province && "Bạn chưa chọn tỉnh thành"}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            {provinces.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            required
            fullWidth
            label="Xã/Thị trấn"
            value={value.commune}
            onChange={(e) => set("commune", e.target.value)}
            error={!value.commune}
            helperText={!value.commune && "Bạn chưa chọn Xã/Thị trấn"}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            {provinces.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Ghi chú giao hàng"
            fullWidth
            placeholder="Ví dụ: Giao sáng thứ 2"
            value={value.shippingNote}
            onChange={(e) => set("shippingNote", e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
