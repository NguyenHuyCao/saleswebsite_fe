"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Button,
  Chip,
  Alert,
  Tooltip,
  IconButton,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { initiateQrPayment, getPaymentStatus, type QrPaymentInitResponse } from "./api";

const POLL_INTERVAL_MS = 5_000;
const TIMEOUT_MINUTES = 15;

interface Props {
  orderId: number;
  paymentMethod: "MOMO" | "VNPAY";
}

export default function QrPaymentView({ orderId, paymentMethod }: Props) {
  const router = useRouter();
  const [qrData, setQrData] = useState<QrPaymentInitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  // Countdown
  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_MINUTES * 60);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Initiate QR ────────────────────────────────────────────────────────────
  useEffect(() => {
    initiateQrPayment(orderId, paymentMethod)
      .then((data) => {
        setQrData(data);
        const remaining = Math.max(0, Math.floor((data.expiredAt - Date.now()) / 1000));
        setSecondsLeft(remaining);
      })
      .catch((e) => setError(e?.message || "Không thể khởi tạo thanh toán QR"))
      .finally(() => setLoading(false));
  }, [orderId, paymentMethod]);

  // ── Countdown timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!qrData || paid) return;
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(countdownRef.current!);
          setTimeoutReached(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current!);
  }, [qrData, paid]);

  // ── Polling payment status ──────────────────────────────────────────────────
  const checkStatus = useCallback(async () => {
    try {
      const status = await getPaymentStatus(orderId);
      if (status.paid) {
        setPaid(true);
        clearInterval(pollRef.current!);
        clearInterval(countdownRef.current!);
        setTimeout(() => router.push(`/order?success=1`), 2000);
      }
    } catch (err) {
      console.warn("[QR-Poll] Lỗi kiểm tra trạng thái:", err);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (!qrData || paid || timeoutReached) return;
    pollRef.current = setInterval(checkStatus, POLL_INTERVAL_MS);

    // Poll ngay khi tab được focus lại (tránh browser throttle background tabs)
    const onVisible = () => {
      if (document.visibilityState === "visible") checkStatus();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(pollRef.current!);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [qrData, paid, timeoutReached, checkStatus]);

  // ── Copy to clipboard ───────────────────────────────────────────────────────
  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPct = (secondsLeft / (TIMEOUT_MINUTES * 60)) * 100;

  // ── RENDER ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress sx={{ color: "#f25c05" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth={520} mx="auto" mt={4}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => router.push("/order")}>
          Về trang đơn hàng
        </Button>
      </Box>
    );
  }

  if (paid) {
    return (
      <Box maxWidth={520} mx="auto" mt={6} textAlign="center">
        <CheckCircleIcon sx={{ fontSize: 72, color: "#4caf50", mb: 2 }} />
        <Typography variant="h5" fontWeight={700} color="#2e7d32" gutterBottom>
          Thanh toán thành công!
        </Typography>
        <Typography color="text.secondary">
          Đơn hàng #{qrData?.orderCode} đã được xác nhận. Đang chuyển hướng...
        </Typography>
        <CircularProgress size={24} sx={{ mt: 3, color: "#4caf50" }} />
      </Box>
    );
  }

  return (
    <Box maxWidth={560} mx="auto" py={4} px={2}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <AccessTimeIcon sx={{ color: timeoutReached ? "#e53935" : "#f25c05" }} />
        <Typography
          variant="h6"
          fontWeight={700}
          color={timeoutReached ? "error" : "inherit"}
        >
          {timeoutReached ? "Đã hết thời gian" : `Thanh toán trong ${formatTime(secondsLeft)}`}
        </Typography>
      </Stack>

      {/* Progress bar */}
      {!timeoutReached && (
        <LinearProgress
          variant="determinate"
          value={progressPct}
          sx={{
            mb: 3,
            height: 6,
            borderRadius: 3,
            bgcolor: "#ffe0cc",
            "& .MuiLinearProgress-bar": { bgcolor: "#f25c05" },
          }}
        />
      )}

      {timeoutReached && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Thời gian thanh toán đã hết. Nếu bạn đã chuyển khoản, hãy nhấn &quot;Đã chuyển khoản&quot;
          để báo bộ phận hỗ trợ kiểm tra thủ công.
        </Alert>
      )}

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* QR Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #f25c05 0%, #ff8c42 100%)",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="rgba(255,255,255,0.85)" mb={1}>
            {paymentMethod === "MOMO" ? "Quét QR bằng ứng dụng MoMo" : "Quét QR bằng ứng dụng ngân hàng"}
          </Typography>

          {qrData?.qrUrl && (
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "#fff",
                p: 1.5,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              <Image
                src={qrData.qrUrl}
                alt="QR Code thanh toán"
                width={200}
                height={200}
                unoptimized
                style={{ display: "block", borderRadius: 4 }}
              />
            </Box>
          )}

          <Chip
            label={`Đơn hàng #${qrData?.orderCode}`}
            sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700 }}
          />
        </Box>

        {/* Payment Info */}
        <Box p={3}>
          {/* Amount */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#fff3e0",
              border: "1.5px solid #ffcc80",
              borderRadius: 2,
              px: 2.5,
              py: 2,
              mb: 2,
            }}
          >
            <Typography fontWeight={700}>Số tiền cần chuyển</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" fontWeight={900} color="#f25c05">
                {qrData?.amount.toLocaleString("vi-VN")}₫
              </Typography>
              <Tooltip title={copied === "amount" ? "Đã sao chép!" : "Sao chép"}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(String(qrData?.amount ?? ""), "amount")}
                >
                  {copied === "amount" ? (
                    <CheckCircleIcon fontSize="small" sx={{ color: "#4caf50" }} />
                  ) : (
                    <ContentCopyIcon fontSize="small" sx={{ color: "#f25c05" }} />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Transfer content – critical */}
          <Box
            sx={{
              bgcolor: "#fff8f5",
              border: "1.5px solid #f7ddd0",
              borderRadius: 2,
              px: 2.5,
              py: 2,
              mb: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC)
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900} fontSize={20} color="#f25c05" letterSpacing={1}>
                {qrData?.transferContent}
              </Typography>
              <Tooltip title={copied === "content" ? "Đã sao chép!" : "Sao chép nội dung"}>
                <IconButton
                  onClick={() => handleCopy(qrData?.transferContent ?? "", "content")}
                >
                  {copied === "content" ? (
                    <CheckCircleIcon sx={{ color: "#4caf50" }} />
                  ) : (
                    <ContentCopyIcon sx={{ color: "#f25c05" }} />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography variant="caption" color="error" fontWeight={600}>
              ⚠ Ghi sai nội dung sẽ không tự động xác nhận được!
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Account details */}
          <Stack spacing={1.5}>
            <CopyRow
              label="Ngân hàng / Ví"
              value={qrData?.bankCode ?? ""}
              field="bank"
              copied={copied}
              onCopy={handleCopy}
            />
            <CopyRow
              label="Số tài khoản"
              value={qrData?.accountNumber ?? ""}
              field="account"
              copied={copied}
              onCopy={handleCopy}
            />
            <CopyRow
              label="Tên tài khoản"
              value={qrData?.accountName ?? ""}
              field="name"
              copied={copied}
              onCopy={handleCopy}
            />
          </Stack>
        </Box>
      </Paper>

      {/* Actions */}
      <Stack spacing={1.5} mt={3}>
        <Alert severity="info" icon={false} sx={{ fontSize: 13 }}>
          Hệ thống tự động xác nhận khi nhận được tiền. Không cần làm thêm bước nào.
        </Alert>

        {/* Manual check – useful when tab was backgrounded or polling was slow */}
        {!timeoutReached && (
          <Button
            variant="outlined"
            fullWidth
            disabled={checking}
            onClick={async () => {
              setChecking(true);
              await checkStatus();
              setChecking(false);
            }}
            sx={{ borderRadius: 2, borderColor: "#f25c05", color: "#f25c05" }}
          >
            {checking ? "Đang kiểm tra..." : "Kiểm tra trạng thái ngay"}
          </Button>
        )}

        {timeoutReached && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => router.push(`/order`)}
            sx={{
              bgcolor: "#f25c05",
              "&:hover": { bgcolor: "#e64a19" },
              fontWeight: 700,
              borderRadius: 2,
              py: 1.5,
            }}
          >
            Tôi đã chuyển khoản – Kiểm tra thủ công
          </Button>
        )}

        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push("/order")}
          sx={{ borderRadius: 2 }}
        >
          Về trang đơn hàng
        </Button>
      </Stack>
    </Box>
  );
}

// ── Sub-component: copy row ───────────────────────────────────────────────────
function CopyRow({
  label,
  value,
  field,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  field: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography fontWeight={600} fontSize={14}>
          {value}
        </Typography>
      </Box>
      <Tooltip title={copied === field ? "Đã sao chép!" : "Sao chép"}>
        <IconButton size="small" onClick={() => onCopy(value, field)}>
          {copied === field ? (
            <CheckCircleIcon fontSize="small" sx={{ color: "#4caf50" }} />
          ) : (
            <ContentCopyIcon fontSize="small" sx={{ color: "#999" }} />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
