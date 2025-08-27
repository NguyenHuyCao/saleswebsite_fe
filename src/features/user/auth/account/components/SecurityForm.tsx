"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import KeyOutline from "mdi-material-ui/KeyOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

import { passwordSchema, type PasswordInput } from "../schemas/password.schema";
import { useChangePassword } from "../hooks/useUser";
import { useState } from "react";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

export default function SecurityForm({
  onBack,
  userId,
}: {
  onBack: () => void;
  userId: string;
}) {
  const { control, handleSubmit } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const { mutateAsync } = useChangePassword(userId);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const onSubmit = async (data: PasswordInput) => {
    try {
      await mutateAsync(data);
      setSnack({
        open: true,
        message: "Cập nhật mật khẩu thành công!",
        type: "success",
      });
    } catch (e: any) {
      setSnack({ open: true, message: e.message, type: "error" });
    }
  };

  const ToggleBtn = (key: keyof typeof show) => (
    <IconButton
      onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
      edge="end"
    >
      {show[key] ? <EyeOutline /> : <EyeOffOutline />}
    </IconButton>
  );

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Typography variant="h6" fontWeight={600}>
        Bảo mật tài khoản
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="currentPassword">Mật khẩu hiện tại</InputLabel>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field, fieldState }) => (
                <OutlinedInput
                  {...field}
                  id="currentPassword"
                  fullWidth
                  type={show.current ? "text" : "password"}
                  error={!!fieldState.error}
                  startAdornment={
                    <InputAdornment position="start">
                      <KeyOutline />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      {ToggleBtn("current")}
                    </InputAdornment>
                  }
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="newPassword">Mật khẩu mới</InputLabel>
            <Controller
              name="newPassword"
              control={control}
              render={({ field, fieldState }) => (
                <OutlinedInput
                  {...field}
                  id="newPassword"
                  fullWidth
                  type={show.next ? "text" : "password"}
                  error={!!fieldState.error}
                  startAdornment={
                    <InputAdornment position="start">
                      <KeyOutline />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      {ToggleBtn("next")}
                    </InputAdornment>
                  }
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="confirmNewPassword">
              Xác nhận mật khẩu mới
            </InputLabel>
            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field, fieldState }) => (
                <OutlinedInput
                  {...field}
                  id="confirmNewPassword"
                  fullWidth
                  type={show.confirm ? "text" : "password"}
                  error={!!fieldState.error}
                  startAdornment={
                    <InputAdornment position="start">
                      <KeyOutline />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      {ToggleBtn("confirm")}
                    </InputAdornment>
                  }
                />
              )}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" gap={2}>
          <Button variant="outlined" onClick={onBack}>
            Quay lại
          </Button>
          <Button type="submit" variant="contained">
            Lưu thay đổi
          </Button>
        </Box>
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
