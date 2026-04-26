"use client";

import { useState, useMemo } from "react";
import {
  Box, Paper, Typography, TextField, Button, Stack,
  InputAdornment, IconButton, CircularProgress, Alert,
  Fade, LinearProgress, Chip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "../queries";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

const checkPasswordStrength = (password: string) => {
  const requirements = [
    { met: password.length >= 8,          text: "Ít nhất 8 ký tự" },
    { met: /[A-Z]/.test(password),        text: "Ít nhất 1 chữ hoa" },
    { met: /[a-z]/.test(password),        text: "Ít nhất 1 chữ thường" },
    { met: /[0-9]/.test(password),        text: "Ít nhất 1 số" },
    { met: /[^A-Za-z0-9]/.test(password), text: "Ký tự đặc biệt (khuyến khích)" },
  ];
  const metCount = requirements.filter((r) => r.met).length;
  const label = ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"][metCount] ?? "Rất yếu";
  const color = ["#f44336", "#ff9800", "#ffc107", "#8bc34a", "#4caf50"][metCount] ?? "#f44336";
  return { score: metCount, label, color, requirements };
};

export default function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [touched, setTouched] = useState({ new: false, confirm: false });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useResetPassword();

  const strength = useMemo(() => checkPasswordStrength(form.newPassword), [form.newPassword]);

  const errors = useMemo(() => {
    const e: { new?: string; confirm?: string } = {};
    if (touched.new) {
      if (!form.newPassword) e.new = "Vui lòng nhập mật khẩu mới";
      else if (!passwordRegex.test(form.newPassword))
        e.new = "Mật khẩu cần ít nhất 8 ký tự, có chữ hoa, chữ thường và số";
    }
    if (touched.confirm) {
      if (!form.confirmPassword) e.confirm = "Vui lòng xác nhận mật khẩu";
      else if (form.newPassword !== form.confirmPassword) e.confirm = "Mật khẩu xác nhận không khớp";
    }
    return e;
  }, [form, touched]);

  const canSubmit = token && passwordRegex.test(form.newPassword) && form.newPassword === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ new: true, confirm: true });
    if (!canSubmit) return;

    setError("");
    try {
      await mutateAsync({ token, newPassword: form.newPassword });
      setDone(true);
    } catch (err: any) {
      setError(err?.message || "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
    }
  };

  if (!token) {
    return (
      <Box sx={{ maxWidth: 460, mx: "auto", px: 2, py: 6, textAlign: "center" }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Link đặt lại mật khẩu không hợp lệ. Vui lòng{" "}
          <strong
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => router.push("/forgot-password")}
          >
            yêu cầu link mới
          </strong>
          .
        </Alert>
      </Box>
    );
  }

  if (done) {
    return (
      <Box sx={{ maxWidth: 460, mx: "auto", px: 2, py: 6 }}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          elevation={4}
          sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, textAlign: "center" }}
        >
          <Box
            sx={{
              width: 72, height: 72, borderRadius: "50%",
              bgcolor: "#e8f5e9", display: "flex",
              alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50" }} />
          </Box>

          <Typography variant="h6" fontWeight={700} gutterBottom>
            Đặt lại mật khẩu thành công!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push("/login")}
            sx={{
              bgcolor: "#f25c05", color: "#fff", fontWeight: 700,
              textTransform: "none", py: 1.5, borderRadius: 2,
              "&:hover": { bgcolor: "#e64a19" },
            }}
          >
            Đăng nhập ngay
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 460, mx: "auto", px: 2, py: 6 }}>
      <Fade in timeout={400}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/login")}
          sx={{ mb: 2, color: "#666", textTransform: "none" }}
        >
          Quay lại đăng nhập
        </Button>
      </Fade>

      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        elevation={4}
        sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}
      >
        <Stack spacing={3}>
          <Box>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: "50%",
                bgcolor: "#e3f2fd", display: "flex",
                alignItems: "center", justifyContent: "center", mb: 2,
              }}
            >
              <LockResetIcon sx={{ fontSize: 28, color: "#1976d2" }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Đặt lại mật khẩu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tạo mật khẩu mới cho tài khoản của bạn.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}{" "}
              <strong
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => router.push("/forgot-password")}
              >
                Yêu cầu link mới
              </strong>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* New password */}
              <Box>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  type={show.new ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, new: true }))}
                  error={!!errors.new}
                  helperText={errors.new}
                  autoFocus
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#999" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShow((s) => ({ ...s, new: !s.new }))} edge="end">
                            {show.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      },
                  }}
                />

                {/* Strength meter */}
                {form.newPassword && (
                  <Fade in timeout={300}>
                    <Box sx={{ mt: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={600}>Độ mạnh:</Typography>
                        <Chip
                          label={strength.label}
                          size="small"
                          sx={{ bgcolor: strength.color, color: "#fff", height: 20, fontSize: "0.65rem" }}
                        />
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(strength.score / 5) * 100}
                        sx={{
                          height: 6, borderRadius: 3, bgcolor: "#f0f0f0",
                          "& .MuiLinearProgress-bar": { bgcolor: strength.color },
                        }}
                      />
                      <Stack spacing={0.4} sx={{ mt: 1 }}>
                        {strength.requirements.map((req, i) => (
                          <Stack key={i} direction="row" alignItems="center" spacing={0.5}>
                            {req.met
                              ? <CheckCircleIcon sx={{ fontSize: 13, color: "#4caf50" }} />
                              : <ErrorIcon sx={{ fontSize: 13, color: "#bbb" }} />}
                            <Typography variant="caption" sx={{ color: req.met ? "#4caf50" : "#999" }}>
                              {req.text}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Fade>
                )}
              </Box>

              {/* Confirm password */}
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                type={show.confirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                error={!!errors.confirm}
                helperText={errors.confirm}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} edge="end">
                          {show.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending}
                sx={{
                  bgcolor: "#f25c05", color: "#fff", fontWeight: 700,
                  textTransform: "none", py: 1.5, borderRadius: 2,
                  "&:hover": { bgcolor: "#e64a19" },
                  "&.Mui-disabled": { bgcolor: "#f0f0f0", color: "#999" },
                }}
              >
                {isPending ? <CircularProgress size={22} color="inherit" /> : "Đặt lại mật khẩu"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}
