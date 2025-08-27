"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import type { User } from "../services";
import { userInfoSchema, type UserInfoInput } from "../schemas/user.schema";
import { useUpdateUser } from "../hooks/useUser";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

export default function PersonalInfoForm({
  onNext,
  user,
}: {
  onNext: () => void;
  user: User | null;
}) {
  const sp = useSearchParams();
  const userId = sp.get("userId")!;
  const { mutateAsync } = useUpdateUser(userId);

  const { control, handleSubmit } = useForm<UserInfoInput>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      gender: (user?.gender as any) || "",
    },
    values: user
      ? {
          username: user.username,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          gender: (user.gender as any) || "",
        }
      : undefined,
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const onSubmit = async (data: UserInfoInput) => {
    try {
      await mutateAsync(data);
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
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={4}
    >
      <Typography variant="h6">Thông tin cá nhân</Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Họ và tên"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Số điện thoại"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Địa chỉ"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field}>
            <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
            <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
            <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
          </RadioGroup>
        )}
      />

      <Box>
        <Button type="submit" variant="contained">
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
