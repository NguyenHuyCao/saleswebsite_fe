"use client";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import { useState } from "react";

const Alert = (props: any) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export default function ChangePasswordForm({
  userId,
  token,
}: {
  userId: number | null;
  token: string | null;
}) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbar({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin.",
        severity: "warning",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Mật khẩu mới không khớp.",
        severity: "error",
      });
      return;
    }

    if (!token) {
      setSnackbar({
        open: true,
        message: "Không xác thực được người dùng.",
        severity: "error",
      });
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/users/change_password${
          userId ? `?userId=${userId}` : ""
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.status === 200) {
        setSnackbar({
          open: true,
          message: data.message || "Cập nhật mật khẩu thành công!",
          severity: "success",
        });

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Cập nhật mật khẩu thất bại!",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setSnackbar({
        open: true,
        message: "Lỗi kết nối tới máy chủ!",
        severity: "error",
      });
    }
  };

  return (
    <Box px={2} py={4} display="flex" justifyContent="center">
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: 4,
          borderRadius: 2,
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          Đổi mật khẩu
        </Typography>

        <form onSubmit={handleSubmit}>
          {[
            {
              name: "currentPassword",
              label: "Mật khẩu hiện tại",
              field: "current",
            },
            { name: "newPassword", label: "Mật khẩu mới", field: "new" },
            {
              name: "confirmPassword",
              label: "Xác nhận mật khẩu mới",
              field: "confirm",
            },
          ].map(({ name, label, field }) => (
            <TextField
              key={name}
              fullWidth
              label={label}
              name={name}
              type={
                showPassword[field as keyof typeof showPassword]
                  ? "text"
                  : "password"
              }
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              sx={{ mb: 2 }}
              size="small"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleToggleVisibility(field as any)}
                      edge="end"
                    >
                      {showPassword[field as keyof typeof showPassword] ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            Cập nhật mật khẩu
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
