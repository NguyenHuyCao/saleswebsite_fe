"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { useSearchParams } from "next/navigation";
import type { User } from "../../users/types";
import { useUpdateUser } from "../queries";

export default function UserCombinedForm({
  onNext,
  userData,
}: {
  onNext: () => void;
  userData: User | null;
}) {
  const sp = useSearchParams();
  const userId = sp.get("userId")!;

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const updateUser = useUpdateUser(userId);

  useEffect(() => {
    if (userData) {
      setForm({
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        gender: userData.gender || "",
      });
    }
  }, [userData]);

  const save = async () => {
    try {
      await updateUser.mutateAsync(form);
      setSnack({
        open: true,
        message: "Cập nhật thông tin thành công!",
        type: "success",
      });
      onNext();
    } catch (e: any) {
      setSnack({ open: true, message: e.message, type: "error" });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Typography variant="h6" mb={3}>
        Thông tin cá nhân
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Họ và tên"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </Grid>
      </Grid>

      <FormLabel>Giới tính</FormLabel>
      <RadioGroup
        row
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
      >
        <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
        <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
        <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
      </RadioGroup>

      <Box>
        <Button variant="contained" onClick={save}>
          Tiếp theo
        </Button>
      </Box>

      <AlertSnackbar
        open={snack.open}
        message={snack.message}
        type={snack.type}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}
