// src/features/admin/users/components/SecurityForm.tsx
"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import {
  Box,
  Typography,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import KeyOutline from "mdi-material-ui/KeyOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { apiChangePassword } from "../../users/api";

export default function SecurityForm({
  onBack,
  email,
  userId,
}: {
  onBack: () => void;
  email: string;
  userId: string;
}) {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmNewPassword: false,
  });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleChange =
    (k: keyof typeof values) => (e: ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }));

  const toggle = (k: keyof typeof values) => () =>
    setValues((v) => ({ ...v, [k]: !v[k] }));

  const onMouseDown = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

  const save = async () => {
    if (values.newPassword !== values.confirmNewPassword) {
      setSnack({
        open: true,
        message: "Mật khẩu xác nhận không khớp",
        type: "error",
      });
      return;
    }
    try {
      await apiChangePassword(userId, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmNewPassword,
      });
      setSnack({
        open: true,
        message: "Cập nhật mật khẩu thành công!",
        type: "success",
      });
      setValues({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmNewPassword: false,
      });
    } catch (e: any) {
      setSnack({ open: true, message: e.message, type: "error" });
    }
  };

  const fields: Array<{
    key: "currentPassword" | "newPassword" | "confirmNewPassword";
    label: string;
  }> = [
    { key: "currentPassword", label: "Mật khẩu hiện tại" },
    { key: "newPassword", label: "Mật khẩu mới" },
    { key: "confirmNewPassword", label: "Xác nhận mật khẩu mới" },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Typography variant="h6" fontWeight={600}>
        Bảo mật tài khoản
      </Typography>

      <Grid container spacing={4}>
        {fields.map(({ key, label }) => {
          const showKey = `show${
            key.charAt(0).toUpperCase() + key.slice(1)
          }` as keyof typeof values;
          return (
            <Grid size={{xs:12, md:6,}}  key={key}>
              <InputLabel htmlFor={key}>{label}</InputLabel>
              <OutlinedInput
                fullWidth
                id={key}
                type={values[showKey] ? "text" : "password"}
                value={values[key]}
                onChange={handleChange(key)}
                startAdornment={
                  <InputAdornment position="start">
                    <KeyOutline />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggle(showKey)}
                      onMouseDown={onMouseDown}
                      edge="end"
                    >
                      {values[showKey] ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
          );
        })}
      </Grid>

      <Box display="flex" gap={2}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={save}>
          Lưu thay đổi
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
