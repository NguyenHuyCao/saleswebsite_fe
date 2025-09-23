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
import { useChangePasswordMe } from "../../queries";

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
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });

  const { mutateAsync, isPending } = useChangePasswordMe();

  const canSubmit = useMemo(() => {
    const { currentPassword, newPassword, confirmPassword } = form;
    if (!currentPassword || !newPassword || !confirmPassword) return false;
    if (newPassword !== confirmPassword) return false;
    if (newPassword.length < 6) return false;
    if (newPassword === currentPassword) return false;
    return true;
  }, [form]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setSnack({
        open: true,
        message:
          form.newPassword !== form.confirmPassword
            ? "Mật khẩu mới không khớp."
            : "Vui lòng kiểm tra lại thông tin.",
        severity: "warning",
      });
      return;
    }
    try {
      await mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      setSnack({
        open: true,
        message: "Đổi mật khẩu thành công!",
        severity: "success",
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setSnack({
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

        <form onSubmit={submit}>
          {[
            {
              name: "currentPassword",
              label: "Mật khẩu hiện tại",
              key: "current",
            },
            { name: "newPassword", label: "Mật khẩu mới", key: "new" },
            {
              name: "confirmPassword",
              label: "Xác nhận mật khẩu",
              key: "confirm",
            },
          ].map(({ name, label, key }) => (
            <TextField
              key={name}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              label={label}
              name={name}
              type={
                show[key as "current" | "new" | "confirm"] ? "text" : "password"
              }
              value={(form as any)[name]}
              onChange={(e) =>
                setForm((p) => ({ ...p, [name]: e.target.value }))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShow((s) => ({
                          ...s,
                          [key]: !s[key as keyof typeof s],
                        }))
                      }
                      edge="end"
                    >
                      {show[key as keyof typeof show] ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
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
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
