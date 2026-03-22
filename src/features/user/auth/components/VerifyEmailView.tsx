"use client";

import { useEffect, useState } from "react";
import {
  Box, Paper, Typography, Button, Stack,
  CircularProgress, Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmail, useResendVerification } from "../queries";

type Status = "loading" | "success" | "error" | "no-token";

export default function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>(token ? "loading" : "no-token");
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState("");

  const { mutateAsync: verifyEmail } = useVerifyEmail();
  const { mutateAsync: resend, isPending: resendPending } = useResendVerification();

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    setResendError("");
    try {
      await resend();
      setResent(true);
    } catch (err: any) {
      setResendError(err?.message || "Không thể gửi lại email. Vui lòng thử sau.");
    }
  };

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
        {/* Loading */}
        {status === "loading" && (
          <Stack spacing={2} alignItems="center">
            <CircularProgress sx={{ color: "#f25c05" }} />
            <Typography variant="body1" color="text.secondary">
              Đang xác thực email của bạn...
            </Typography>
          </Stack>
        )}

        {/* Success */}
        {status === "success" && (
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: 72, height: 72, borderRadius: "50%",
                bgcolor: "#e8f5e9", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50" }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              Email xác thực thành công!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập và mua hàng ngay.
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
          </Stack>
        )}

        {/* Error (invalid/expired token) */}
        {status === "error" && (
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: 72, height: 72, borderRadius: "50%",
                bgcolor: "#fdecea", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 40, color: "#f44336" }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              Link xác thực không hợp lệ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Link có thể đã hết hạn (sau 24 giờ) hoặc đã được sử dụng trước đó.
              Bạn có thể yêu cầu gửi lại email xác thực.
            </Typography>

            {resendError && (
              <Alert severity="error" sx={{ borderRadius: 2, width: "100%", textAlign: "left" }}>
                {resendError}
              </Alert>
            )}

            {resent ? (
              <Alert severity="success" sx={{ borderRadius: 2, width: "100%", textAlign: "left" }}>
                Email xác thực đã được gửi lại! Kiểm tra hộp thư của bạn.
              </Alert>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={handleResend}
                disabled={resendPending}
                sx={{
                  bgcolor: "#f25c05", color: "#fff", fontWeight: 700,
                  textTransform: "none", py: 1.5, borderRadius: 2,
                  "&:hover": { bgcolor: "#e64a19" },
                }}
              >
                {resendPending ? <CircularProgress size={22} color="inherit" /> : "Gửi lại email xác thực"}
              </Button>
            )}

            <Button
              variant="text"
              onClick={() => router.push("/login")}
              sx={{ textTransform: "none", color: "#666" }}
            >
              Quay lại đăng nhập
            </Button>
          </Stack>
        )}

        {/* No token in URL */}
        {status === "no-token" && (
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: 72, height: 72, borderRadius: "50%",
                bgcolor: "#fff3e0", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <MarkEmailReadIcon sx={{ fontSize: 40, color: "#f25c05" }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              Xác thực email
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng mở link từ email xác thực mà chúng tôi đã gửi cho bạn.
              Kiểm tra hộp thư và thư mục spam.
            </Typography>

            {resendError && (
              <Alert severity="error" sx={{ borderRadius: 2, width: "100%", textAlign: "left" }}>
                {resendError}
              </Alert>
            )}

            {resent ? (
              <Alert severity="success" sx={{ borderRadius: 2, width: "100%", textAlign: "left" }}>
                Email xác thực đã được gửi lại! Kiểm tra hộp thư của bạn.
              </Alert>
            ) : (
              <Button
                variant="outlined"
                fullWidth
                onClick={handleResend}
                disabled={resendPending}
                sx={{ textTransform: "none", borderRadius: 2, py: 1.5 }}
              >
                {resendPending ? <CircularProgress size={22} /> : "Gửi lại email xác thực"}
              </Button>
            )}

            <Button
              variant="text"
              onClick={() => router.push("/login")}
              sx={{ textTransform: "none", color: "#666" }}
            >
              Quay lại đăng nhập
            </Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
