"use client";

import { TextField, MenuItem, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";

const provinces = ["Hà Nội", "TP.HCM", "Đà Nẵng"];

export default function ShippingForm() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    province: "",
    commune: "",
    shippingNote: "",
  });

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

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
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!form.email}
            helperText={!form.email && "Vui lòng nhập email"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Họ và tên"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!form.name}
            helperText={!form.name && "Vui lòng nhập họ tên"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Địa chỉ cụ thể"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            required
            fullWidth
            label="Tỉnh/Thành"
            value={form.province}
            onChange={(e) => handleChange("province", e.target.value)}
            error={!form.province}
            helperText={!form.province && "Bạn chưa chọn tỉnh thành"}
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
            value={form.commune}
            onChange={(e) => handleChange("commune", e.target.value)}
            error={!form.commune}
            helperText={!form.commune && "Bạn chưa chọn Xã/Thị trấn"}
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
            value={form.shippingNote}
            onChange={(e) => handleChange("shippingNote", e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
