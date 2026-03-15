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
  Breadcrumbs,
  Link,
  Stack,
  Chip,
  LinearProgress,
  Tooltip,
  Alert,
  Fade,
} from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import { useChangePasswordMe } from "../../queries";
import { useRouter } from "next/navigation";

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
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <MuiAlert
      elevation={6}
      variant="filled"
      severity={severity}
      onClose={onClose}
      sx={{ fontSize: 14, borderRadius: 2 }}
    >
      {message}
    </MuiAlert>
  </Snackbar>
);

// Password strength checker
const checkPasswordStrength = (
  password: string,
): {
  score: number;
  label: string;
  color: string;
  requirements: { met: boolean; text: string }[];
} => {
  const requirements = [
    { met: password.length >= 8, text: "Ít nhất 8 ký tự" },
    { met: /[A-Z]/.test(password), text: "Ít nhất 1 chữ hoa" },
    { met: /[a-z]/.test(password), text: "Ít nhất 1 chữ thường" },
    { met: /[0-9]/.test(password), text: "Ít nhất 1 số" },
    { met: /[^A-Za-z0-9]/.test(password), text: "Ít nhất 1 ký tự đặc biệt" },
  ];

  const metCount = requirements.filter((r) => r.met).length;

  let label = "Rất yếu";
  let color = "#f44336";

  if (metCount === 5) {
    label = "Rất mạnh";
    color = "#4caf50";
  } else if (metCount === 4) {
    label = "Mạnh";
    color = "#8bc34a";
  } else if (metCount === 3) {
    label = "Trung bình";
    color = "#ffc107";
  } else if (metCount === 2) {
    label = "Yếu";
    color = "#ff9800";
  }

  return {
    score: metCount,
    label,
    color,
    requirements,
  };
};

export default function ChangePasswordView() {
  const router = useRouter();
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
  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });

  const currentInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync, isPending } = useChangePasswordMe();

  // Auto focus on current password field
  useEffect(() => {
    currentInputRef.current?.focus();
  }, []);

  const passwordStrength = useMemo(
    () => checkPasswordStrength(form.newPassword),
    [form.newPassword],
  );

  const errors = useMemo(() => {
    const err: {
      current?: string;
      new?: string;
      confirm?: string;
    } = {};

    if (touched.current && !form.currentPassword) {
      err.current = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (touched.new) {
      if (!form.newPassword) {
        err.new = "Vui lòng nhập mật khẩu mới";
      } else if (form.newPassword.length < 6) {
        err.new = "Mật khẩu phải có ít nhất 6 ký tự";
      }
    }

    if (touched.confirm) {
      if (!form.confirmPassword) {
        err.confirm = "Vui lòng xác nhận mật khẩu";
      } else if (form.newPassword !== form.confirmPassword) {
        err.confirm = "Mật khẩu xác nhận không khớp";
      }
    }

    if (
      touched.current &&
      touched.new &&
      form.currentPassword === form.newPassword
    ) {
      err.new = "Mật khẩu mới không được giống mật khẩu hiện tại";
    }

    return err;
  }, [form, touched]);

  const canSubmit = useMemo(() => {
    return (
      form.currentPassword &&
      form.newPassword &&
      form.confirmPassword &&
      form.newPassword === form.confirmPassword &&
      form.newPassword.length >= 6 &&
      form.currentPassword !== form.newPassword &&
      passwordStrength.score >= 3 // Yêu cầu mật khẩu từ trung bình trở lên
    );
  }, [form, passwordStrength.score]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ current: true, new: true, confirm: true });

    if (!canSubmit) {
      setSnack({
        open: true,
        message: "Vui lòng kiểm tra lại thông tin và đảm bảo mật khẩu đủ mạnh",
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
        message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
        severity: "success",
      });

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTouched({ current: false, new: false, confirm: false });

      // Redirect to login after success
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setSnack({
        open: true,
        message: err?.message || "Lỗi kết nối tới máy chủ!",
        severity: "error",
      });
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", px: 2, py: 4 }}>
      {/* Back button */}
      <Fade in timeout={400}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 2, color: "#666" }}
        >
          Quay lại
        </Button>
      </Fade>

      {/* Main form */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={4}
        sx={{
          width: "100%",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Thay đổi mật khẩu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng nhập mật khẩu hiện tại và tạo mật khẩu mới
            </Typography>
          </Box>

          <form onSubmit={submit}>
            <Stack spacing={2.5}>
              {/* Current Password */}
              <TextField
                fullWidth
                size="medium"
                label="Mật khẩu hiện tại"
                name="currentPassword"
                type={show.current ? "text" : "password"}
                value={form.currentPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, currentPassword: e.target.value }))
                }
                onBlur={() => handleBlur("current")}
                error={touched.current && !!errors.current}
                helperText={touched.current && errors.current}
                inputRef={currentInputRef}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShow((s) => ({ ...s, current: !s.current }))
                        }
                        edge="end"
                      >
                        {show.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              {/* New Password with strength meter */}
              <Box>
                <TextField
                  fullWidth
                  size="medium"
                  label="Mật khẩu mới"
                  name="newPassword"
                  type={show.new ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  onBlur={() => handleBlur("new")}
                  error={touched.new && !!errors.new}
                  helperText={touched.new && errors.new}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShow((s) => ({ ...s, new: !s.new }))
                          }
                          edge="end"
                        >
                          {show.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                {/* Password Strength Indicator */}
                {form.newPassword && (
                  <Fade in timeout={300}>
                    <Box sx={{ mt: 1.5 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="caption" fontWeight={600}>
                          Độ mạnh mật khẩu:
                        </Typography>
                        <Chip
                          label={passwordStrength.label}
                          size="small"
                          sx={{
                            bgcolor: passwordStrength.color,
                            color: "#fff",
                            height: 20,
                            fontSize: "0.65rem",
                          }}
                        />
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength.score / 5) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "#f0f0f0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: passwordStrength.color,
                          },
                        }}
                      />

                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          gutterBottom
                        >
                          Yêu cầu:
                        </Typography>
                        <Stack spacing={0.5}>
                          {passwordStrength.requirements.map((req, idx) => (
                            <Stack
                              key={idx}
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              {req.met ? (
                                <CheckCircleIcon
                                  sx={{ fontSize: 14, color: "#4caf50" }}
                                />
                              ) : (
                                <ErrorIcon
                                  sx={{ fontSize: 14, color: "#f44336" }}
                                />
                              )}
                              <Typography
                                variant="caption"
                                sx={{
                                  color: req.met ? "#4caf50" : "#f44336",
                                  textDecoration: req.met ? "none" : "none",
                                }}
                              >
                                {req.text}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </Fade>
                )}
              </Box>

              {/* Confirm Password */}
              <TextField
                fullWidth
                size="medium"
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                type={show.confirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                onBlur={() => handleBlur("confirm")}
                error={touched.confirm && !!errors.confirm}
                helperText={touched.confirm && errors.confirm}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShow((s) => ({ ...s, confirm: !s.confirm }))
                        }
                        edge="end"
                      >
                        {show.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              {/* Tips */}
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="caption" fontWeight={600}>
                  Mẹo bảo mật:
                </Typography>
                <Typography variant="caption" display="block">
                  • Không sử dụng mật khẩu dễ đoán như "123456" hoặc "password"
                </Typography>
                <Typography variant="caption" display="block">
                  • Không chia sẻ mật khẩu với bất kỳ ai
                </Typography>
                <Typography variant="caption" display="block">
                  • Nên thay đổi mật khẩu định kỳ 3-6 tháng/lần
                </Typography>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending || !canSubmit}
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "none",
                  py: 1.5,
                  mt: 1,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#e64a19" },
                  "&.Mui-disabled": { bgcolor: "#f0f0f0", color: "#999" },
                }}
              >
                {isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </Button>
            </Stack>
          </form>
        </Stack>
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
