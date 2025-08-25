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
  CircularProgress,
} from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useChangePasswordMe } from "@/features/user/auth/account/hooks/useUser";

const AlertSnackbar = ({
  open,
  message,
  severity,
  onClose,
}: {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <MuiAlert
      elevation={6}
      variant="filled"
      severity={severity}
      onClose={onClose}
      sx={{ fontSize: 14 }}
    >
      {message}
    </MuiAlert>
  </Snackbar>
);

export default function ChangePasswordView() {
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
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });

  const { mutateAsync, isPending } = useChangePasswordMe();

  const canSubmit = useMemo(() => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    if (!currentPassword || !newPassword || !confirmPassword) return false;
    if (newPassword !== confirmPassword) return false;
    if (newPassword.length < 6) return false;
    if (newPassword === currentPassword) return false;
    return true;
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleToggleVisibility = (field: keyof typeof showPassword) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setSnackbar({
        open: true,
        message:
          formData.newPassword !== formData.confirmPassword
            ? "Mật khẩu mới không khớp."
            : "Vui lòng kiểm tra lại thông tin.",
        severity: "warning",
      });
      return;
    }

    try {
      const res = await mutateAsync({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
      });

      const ok = res?.status === 200;
      setSnackbar({
        open: true,
        message:
          res?.message ||
          (ok ? "Đổi mật khẩu thành công!" : "Đổi mật khẩu thất bại."),
        severity: ok ? "success" : "error",
      });

      if (ok)
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.message || "Lỗi kết nối tới máy chủ!",
        severity: "error",
      });
    }
  };

  return (
    <Box px={2} py={4} display="flex" justifyContent="center">
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          Thay đổi mật khẩu
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
              label: "Xác nhận mật khẩu",
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
            disabled={isPending || !canSubmit}
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              py: 1.2,
              mt: 1,
              borderRadius: 2,
              "&:hover": { bgcolor: "#222" },
            }}
          >
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Cập nhật mật khẩu"
            )}
          </Button>
        </form>
      </Paper>

      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
