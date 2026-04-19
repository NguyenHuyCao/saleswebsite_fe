"use client";

import { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button, Stack,
  InputAdornment, CircularProgress, Alert, Fade,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "../queries";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useForgotPassword();

  const emailError = touched && !emailRegex.test(email) ? "Email không hợp lệ" : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!emailRegex.test(email)) return;

    setError("");
    try {
      await mutateAsync({ email });
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  if (sent) {
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
            <MarkEmailReadIcon sx={{ fontSize: 40, color: "#4caf50" }} />
          </Box>

          <Typography variant="h6" fontWeight={700} gutterBottom>
            Email đã được gửi!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới{" "}
            <strong>{email}</strong>. Vui lòng kiểm tra hộp thư (kể cả spam).
          </Typography>

          <Alert severity="info" sx={{ borderRadius: 2, mb: 3, textAlign: "left" }}>
            <Typography variant="caption" display="block">
              • Link đặt lại mật khẩu có hiệu lực <strong>15 phút</strong>
            </Typography>
            <Typography variant="caption" display="block">
              • Nếu không nhận được email, kiểm tra thư mục spam
            </Typography>
            <Typography variant="caption" display="block">
              • Mỗi địa chỉ email chỉ được gửi tối đa 5 lần/10 phút
            </Typography>
          </Alert>

          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              onClick={() => { setSent(false); setEmail(""); setTouched(false); }}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Gửi lại email khác
            </Button>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/login")}
              sx={{ textTransform: "none", color: "#666" }}
            >
              Quay lại đăng nhập
            </Button>
          </Stack>
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
          {/* Header */}
          <Box>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: "50%",
                bgcolor: "#fff3e0", display: "flex",
                alignItems: "center", justifyContent: "center", mb: 2,
              }}
            >
              <EmailIcon sx={{ fontSize: 28, color: "#f25c05" }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Quên mật khẩu?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Địa chỉ email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                error={!!emailError}
                helperText={emailError}
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#999" }} />
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
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "none",
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#e64a19" },
                  "&.Mui-disabled": { bgcolor: "#f0f0f0", color: "#999" },
                }}
              >
                {isPending
                  ? <CircularProgress size={22} color="inherit" />
                  : "Gửi link đặt lại mật khẩu"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}
