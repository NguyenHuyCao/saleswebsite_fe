"use client";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stack,
  Chip,
  LinearProgress,
  Grid,
  Divider,
} from "@mui/material";
import { useToast } from "@/lib/toast/ToastContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SecurityIcon from "@mui/icons-material/Security";
import ShieldIcon from "@mui/icons-material/Shield";
import KeyIcon from "@mui/icons-material/Key";
import UpdateIcon from "@mui/icons-material/Update";
import { useMemo, useState, useEffect, useRef } from "react";
import { useChangePasswordMe } from "../../queries";
import { useRouter } from "next/navigation";

const checkPasswordStrength = (password: string) => {
  const requirements = [
    { met: password.length >= 8, text: "Ít nhất 8 ký tự" },
    { met: /[A-Z]/.test(password), text: "Ít nhất 1 chữ hoa" },
    { met: /[a-z]/.test(password), text: "Ít nhất 1 chữ thường" },
    { met: /[0-9]/.test(password), text: "Ít nhất 1 số" },
    { met: /[^A-Za-z0-9]/.test(password), text: "Ít nhất 1 ký tự đặc biệt" },
  ];
  const metCount = requirements.filter((r) => r.met).length;
  const labels = [
    "Rất yếu",
    "Rất yếu",
    "Yếu",
    "Trung bình",
    "Mạnh",
    "Rất mạnh",
  ];
  const colors = [
    "#f44336",
    "#f44336",
    "#ff9800",
    "#ffc107",
    "#8bc34a",
    "#4caf50",
  ];
  return {
    score: metCount,
    label: labels[metCount],
    color: colors[metCount],
    requirements,
  };
};

const TIPS = [
  {
    icon: <ShieldIcon sx={{ fontSize: 20 }} />,
    text: "Dùng ít nhất 8 ký tự kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt",
  },
  {
    icon: <KeyIcon sx={{ fontSize: 20 }} />,
    text: "Không dùng thông tin cá nhân như tên, ngày sinh làm mật khẩu",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 20 }} />,
    text: "Không chia sẻ mật khẩu với bất kỳ ai, kể cả nhân viên hỗ trợ",
  },
  {
    icon: <UpdateIcon sx={{ fontSize: 20 }} />,
    text: "Thay đổi mật khẩu định kỳ 3–6 tháng để tăng bảo mật",
  },
];

export default function ChangePasswordView() {
  const router = useRouter();
  const { showToast } = useToast();
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

  const currentInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync, isPending } = useChangePasswordMe();

  useEffect(() => {
    currentInputRef.current?.focus();
  }, []);

  const passwordStrength = useMemo(
    () => checkPasswordStrength(form.newPassword),
    [form.newPassword],
  );

  const errors = useMemo(() => {
    const err: { current?: string; new?: string; confirm?: string } = {};
    if (touched.current && !form.currentPassword)
      err.current = "Vui lòng nhập mật khẩu hiện tại";
    if (touched.new) {
      if (!form.newPassword) err.new = "Vui lòng nhập mật khẩu mới";
      else if (form.newPassword.length < 6)
        err.new = "Mật khẩu phải có ít nhất 6 ký tự";
      else if (touched.current && form.currentPassword === form.newPassword)
        err.new = "Mật khẩu mới không được giống mật khẩu hiện tại";
    }
    if (touched.confirm) {
      if (!form.confirmPassword) err.confirm = "Vui lòng xác nhận mật khẩu";
      else if (form.newPassword !== form.confirmPassword)
        err.confirm = "Mật khẩu xác nhận không khớp";
    }
    return err;
  }, [form, touched]);

  const canSubmit = useMemo(
    () =>
      !!(
        form.currentPassword &&
        form.newPassword &&
        form.confirmPassword &&
        form.newPassword === form.confirmPassword &&
        form.newPassword.length >= 6 &&
        form.currentPassword !== form.newPassword &&
        passwordStrength.score >= 3
      ),
    [form, passwordStrength.score],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ current: true, new: true, confirm: true });
    if (!canSubmit) {
      showToast(
        "Vui lòng kiểm tra lại thông tin và đảm bảo mật khẩu đủ mạnh",
        "warning",
      );
      return;
    }
    try {
      await mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      showToast("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.", "success", "Đổi mật khẩu");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTouched({ current: false, new: false, confirm: false });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      showToast(err?.message || "Lỗi kết nối tới máy chủ!", "error");
    }
  };

  const PasswordField = ({
    label,
    fieldKey,
    value,
    showVal,
    autoComplete,
  }: {
    label: string;
    fieldKey: "current" | "new" | "confirm";
    value: string;
    showVal: boolean;
    autoComplete: string;
  }) => (
    <TextField
      fullWidth
      size="small"
      label={label}
      type={showVal ? "text" : "password"}
      value={value}
      onChange={(e) =>
        setForm((p) => ({
          ...p,
          [`${fieldKey === "current" ? "currentPassword" : fieldKey === "new" ? "newPassword" : "confirmPassword"}`]:
            e.target.value,
        }))
      }
      onBlur={() => setTouched((p) => ({ ...p, [fieldKey]: true }))}
      error={touched[fieldKey] && !!errors[fieldKey]}
      helperText={touched[fieldKey] && errors[fieldKey]}
      autoComplete={autoComplete}
      inputRef={fieldKey === "current" ? currentInputRef : undefined}
      required
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ fontSize: 18, color: "#999" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() =>
                  setShow((s) => ({ ...s, [fieldKey]: !s[fieldKey] }))
                }
              >
                {showVal ? (
                  <VisibilityOff sx={{ fontSize: 18 }} />
                ) : (
                  <Visibility sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );

  return (
    <Box
      sx={{
        py: { xs: 2, md: 4 },
        animation: "fadeIn 0.4s ease both",
        "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
      }}
    >
      {/* Back */}
      {/* <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        size="small"
        sx={{ mb: 2.5, color: "#666", textTransform: "none", fontWeight: 600 }}
      >
        Quay lại
      </Button> */}

      <Grid container spacing={3} alignItems="stretch">
        {/* Left: Security info panel */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              background:
                "linear-gradient(145deg, #f25c05 0%, #e03d00 60%, #c43200 100%)",
              p: { xs: 3, sm: 4 },
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Icon + title */}
            <Box>
              <Box
                sx={{
                  display: "inline-flex",
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 2,
                  p: 1.5,
                  mb: 2,
                }}
              >
                <SecurityIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography
                variant="h5"
                fontWeight={800}
                lineHeight={1.2}
                gutterBottom
              >
                Bảo mật tài khoản
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Mật khẩu mạnh giúp bảo vệ thông tin cá nhân và đơn hàng của bạn
                khỏi truy cập trái phép.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

            {/* Tips */}
            <Stack spacing={2}>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{
                  opacity: 0.7,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Lưu ý bảo mật
              </Typography>
              {TIPS.map((tip, i) => (
                <Stack
                  key={i}
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                >
                  <Box sx={{ mt: 0.25, opacity: 0.9, flexShrink: 0 }}>
                    {tip.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, lineHeight: 1.5 }}
                  >
                    {tip.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Bottom badge */}
            <Box sx={{ mt: "auto", pt: 2 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 2,
                  p: 2,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <ShieldIcon sx={{ fontSize: 20, color: "#ffb700" }} />
                  <Typography variant="body2" fontWeight={600}>
                    Cường Hoa — Bảo mật 2 lớp
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.75, display: "block", mt: 0.5 }}
                >
                  Tài khoản của bạn được mã hóa và bảo vệ toàn diện
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right: Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #f0f0f0",
              p: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Thay đổi mật khẩu
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Nhập mật khẩu hiện tại và tạo mật khẩu mới cho tài khoản
            </Typography>

            <form
              onSubmit={submit}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Stack spacing={2.5} sx={{ flex: 1 }}>
                {/* Current password */}
                <PasswordField
                  label="Mật khẩu hiện tại"
                  fieldKey="current"
                  value={form.currentPassword}
                  showVal={show.current}
                  autoComplete="current-password"
                />

                {/* New password + strength */}
                <Box>
                  <PasswordField
                    label="Mật khẩu mới"
                    fieldKey="new"
                    value={form.newPassword}
                    showVal={show.new}
                    autoComplete="new-password"
                  />

                  {form.newPassword && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: "#fafafa",
                        borderRadius: 2,
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="text.secondary"
                        >
                          Độ mạnh mật khẩu
                        </Typography>
                        <Chip
                          label={passwordStrength.label}
                          size="small"
                          sx={{
                            bgcolor: passwordStrength.color,
                            color: "#fff",
                            height: 20,
                            fontSize: "0.62rem",
                            fontWeight: 700,
                          }}
                        />
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength.score / 5) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "#e8e8e8",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: passwordStrength.color,
                            borderRadius: 3,
                            transition: "width 0.4s ease",
                          },
                        }}
                      />
                      <Grid container spacing={0.5} sx={{ mt: 1 }}>
                        {passwordStrength.requirements.map((req, idx) => (
                          <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              {req.met ? (
                                <CheckCircleIcon
                                  sx={{ fontSize: 13, color: "#4caf50" }}
                                />
                              ) : (
                                <ErrorIcon
                                  sx={{ fontSize: 13, color: "#bbb" }}
                                />
                              )}
                              <Typography
                                variant="caption"
                                sx={{ color: req.met ? "#4caf50" : "#999" }}
                              >
                                {req.text}
                              </Typography>
                            </Stack>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>

                {/* Confirm password */}
                <PasswordField
                  label="Xác nhận mật khẩu mới"
                  fieldKey="confirm"
                  value={form.confirmPassword}
                  showVal={show.confirm}
                  autoComplete="new-password"
                />

                {/* Match indicator */}
                {form.confirmPassword && (
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    {form.newPassword === form.confirmPassword ? (
                      <CheckCircleIcon
                        sx={{ fontSize: 16, color: "#4caf50" }}
                      />
                    ) : (
                      <ErrorIcon sx={{ fontSize: 16, color: "#f44336" }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          form.newPassword === form.confirmPassword
                            ? "#4caf50"
                            : "#f44336",
                        fontWeight: 500,
                      }}
                    >
                      {form.newPassword === form.confirmPassword
                        ? "Mật khẩu khớp"
                        : "Mật khẩu chưa khớp"}
                    </Typography>
                  </Stack>
                )}

                <Box sx={{ mt: "auto", pt: 1 }}>
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
                      borderRadius: 2,
                      fontSize: "0.95rem",
                      "&:hover": { bgcolor: "#e64a19" },
                      "&.Mui-disabled": { bgcolor: "#f0f0f0", color: "#bbb" },
                    }}
                  >
                    {isPending ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Cập nhật mật khẩu"
                    )}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
