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
import { passwordSchema } from "@/features/user/auth/validators";
import type { ChangePasswordInput } from "@/features/user/auth/types";
import { useChangePassword } from "../../users/queries";
import { useState } from "react";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

export default function SecurityForm({
  onBack,
  userId,
}: {
  onBack: () => void;
  userId: string;
}) {
  const { control, handleSubmit } = useForm<ChangePasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "", // <-- confirmPassword
    },
  });

  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  type SnackbarType = "success" | "error" | "info" | "warning";
  type SnackbarState = { open: boolean; message: string; type: SnackbarType };
  const { mutateAsync } = useChangePassword(userId);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    type: "success" as const,
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await mutateAsync(data);
      setSnackbar({
        open: true,
        message: "Cập nhật mật khẩu thành công!",
        type: "success",
      });
    } catch (e: any) {
      setSnackbar({ open: true, message: e.message, type: "error" });
    }
  };

  const ToggleBtn = (k: keyof typeof show) => (
    <IconButton
      onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))}
      edge="end"
    >
      {show[k] ? <EyeOutline /> : <EyeOffOutline />}
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
            <InputLabel htmlFor="confirmPassword">
              Xác nhận mật khẩu mới
            </InputLabel>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <OutlinedInput
                  {...field}
                  id="confirmPassword"
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
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}
