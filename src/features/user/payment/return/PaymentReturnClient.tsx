"use client";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { motion } from "framer-motion";

type Provider = "momo" | "vnpay";

function ReturnContent({ provider }: { provider: Provider }) {
  const router = useRouter();
  const params = useSearchParams();

  const { success, orderId, message } = useMemo(() => {
    if (provider === "momo") {
      const resultCode = params.get("resultCode");
      const isSuccess = resultCode === "0";
      return {
        success: isSuccess,
        orderId: params.get("orderId") ?? "",
        message: isSuccess
          ? "Thanh toán MoMo thành công! Đơn hàng của bạn đang được xử lý."
          : params.get("message") ?? "Thanh toán MoMo thất bại hoặc bị huỷ.",
      };
    } else {
      const code = params.get("vnp_ResponseCode");
      const isSuccess = code === "00";
      return {
        success: isSuccess,
        orderId: params.get("vnp_TxnRef") ?? "",
        message: isSuccess
          ? "Thanh toán VNPay thành công! Đơn hàng của bạn đang được xử lý."
          : "Thanh toán VNPay thất bại hoặc bị huỷ.",
      };
    }
  }, [provider, params]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Paper
            elevation={4}
            sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: "center" }}
          >
            <Box sx={{ mb: 3 }}>
              {success ? (
                <CheckCircleIcon
                  sx={{ fontSize: 80, color: "#4caf50" }}
                />
              ) : (
                <CancelIcon sx={{ fontSize: 80, color: "#f44336" }} />
              )}
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              {success ? "Thanh toán thành công!" : "Thanh toán thất bại"}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.7 }}
            >
              {message}
            </Typography>

            {orderId && (
              <Box
                sx={{
                  bgcolor: success ? "#f0fff4" : "#fff5f5",
                  border: `1px solid ${success ? "#c8e6c9" : "#ffcdd2"}`,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  mb: 3,
                  display: "inline-block",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Mã đơn hàng: <strong>{orderId}</strong>
                </Typography>
              </Box>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                onClick={() => router.push("/order")}
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#e64a19" },
                }}
              >
                Xem đơn hàng của tôi
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push("/")}
                sx={{
                  borderColor: "#f25c05",
                  color: "#f25c05",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#fff8f0" },
                }}
              >
                Về trang chủ
              </Button>
            </Stack>

            {!success && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="text"
                  onClick={() => router.push("/cart")}
                  sx={{ color: "#f25c05", fontWeight: 600 }}
                >
                  Thử lại thanh toán
                </Button>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export default function PaymentReturnClient({ provider }: { provider: Provider }) {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ color: "#f25c05" }} />
        </Box>
      }
    >
      <ReturnContent provider={provider} />
    </Suspense>
  );
}
