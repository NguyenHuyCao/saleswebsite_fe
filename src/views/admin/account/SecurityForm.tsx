"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import KeyOutline from "mdi-material-ui/KeyOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import AlertSnackbar from "@/model/notify/AlertSnackbar";

const SecurityForm = ({
  onBack,
  email,
}: {
  onBack: () => void;
  email: string;
  userId?: string | null;
}) => {
  const [values, setValues] = useState({
    newPassword: "",
    currentPassword: "",
    confirmNewPassword: "",
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const handleChange =
    (prop: keyof typeof values) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const toggleVisibility = (prop: keyof typeof values) => () => {
    setValues({ ...values, [prop]: !values[prop] });
  };

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSave = async () => {
    if (values.newPassword !== values.confirmNewPassword) {
      setSnackbar({
        open: true,
        message: "Mật khẩu xác nhận không khớp",
        severity: "error",
      });
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/change_password?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmNewPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Cập nhật mật khẩu thất bại");

      setSnackbar({
        open: true,
        message: "Cập nhật mật khẩu thành công!",
        severity: "success",
      });

      setValues({
        newPassword: "",
        currentPassword: "",
        confirmNewPassword: "",
        showNewPassword: false,
        showCurrentPassword: false,
        showConfirmNewPassword: false,
      });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Typography variant="h6" fontWeight={600}>
        Bảo mật tài khoản
      </Typography>

      <Grid container spacing={4}>
        {["currentPassword", "newPassword", "confirmNewPassword"].map((key) => (
          <Grid item xs={12} md={6} key={key}>
            <InputLabel htmlFor={key}>
              {key === "currentPassword"
                ? "Mật khẩu hiện tại"
                : key === "newPassword"
                ? "Mật khẩu mới"
                : "Xác nhận mật khẩu mới"}
            </InputLabel>
            <OutlinedInput
              fullWidth
              id={key}
              type={
                values[
                  `show${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }` as keyof typeof values
                ]
                  ? "text"
                  : "password"
              }
              value={values[key as keyof typeof values]}
              onChange={handleChange(key as keyof typeof values)}
              startAdornment={
                <InputAdornment position="start">
                  <KeyOutline />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleVisibility(
                      `show${
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }` as keyof typeof values
                    )}
                    onMouseDown={handleMouseDown}
                    edge="end"
                  >
                    {values[
                      `show${
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }` as keyof typeof values
                    ] ? (
                      <EyeOutline />
                    ) : (
                      <EyeOffOutline />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
        ))}
      </Grid>

      <Box display="flex" gap={2} justifyContent="flex-start">
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </Box>

      <AlertSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default SecurityForm;
