"use client";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { mutate as swrMutate } from "swr";
import { useMomoConfigQuery } from "../momo/queries";
import { DEFAULT_MOMO_INFO } from "../momo/constants";
import { api } from "@/lib/api/http";
import { useToast } from "@/lib/toast/ToastContext";
import { useSocket } from "@/lib/socket/SocketContext";
import { CART_COUNT_KEY, ORDERS_COUNT_KEY } from "@/constants/apiKeys";

type PaymentStatus = "pending" | "confirmed" | "failed";

const POLL_INTERVAL_MS = 5000;

async function fetchOrderStatus(orderId: string): Promise<string> {
  const data = await api.get<{ status: string } | { result: { status: string } }>(
    `/api/v1/orders/${orderId}`
  );
  if ("result" in data && data.result) return data.result.status;
  if ("status" in data) return (data as { status: string }).status;
  return "";
}

function PendingContent() {
  const router = useRouter();
  const params = useSearchParams();

  const orderId = params.get("orderId") ?? "";
  const method = (params.get("method") ?? "MOMO").toUpperCase();
  const amount = Number(params.get("amount") ?? 0);
  const externalUrl = params.get("paymentUrl") ?? "";

  const { data, isLoading } = useMomoConfigQuery();
  const cfg = useMemo(() => data ?? DEFAULT_MOMO_INFO, [data]);

  const qc = useQueryClient();
  const { showToast } = useToast();
  const { refresh: refreshNotifications } = useSocket();

  const [copied, setCopied] = useState<"phone" | "note" | null>(null);
  const [payStatus, setPayStatus] = useState<PaymentStatus>("pending");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const copy = async (text: string, key: "phone" | "note") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  // Polling trạng thái đơn hàng
  useEffect(() => {
    if (!orderId) return;

    const check = async () => {
      try {
        const status = await fetchOrderStatus(orderId);
        if (status === "CONFIRMED" || status === "SHIPPING" || status === "DELIVERED") {
          setPayStatus("confirmed");
          if (timerRef.current) clearInterval(timerRef.current);
        } else if (status === "FAILED" || status === "CANCELLED") {
          setPayStatus("failed");
          if (timerRef.current) clearInterval(timerRef.current);
        }
      } catch {}
    };

    check(); // kiểm tra ngay
    timerRef.current = setInterval(check, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [orderId]);

  // Khi xác nhận thanh toán → làm mới dữ liệu và về trang chủ
  useEffect(() => {
    if (payStatus === "confirmed") {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders", "me"] });
      swrMutate(CART_COUNT_KEY);
      swrMutate(ORDERS_COUNT_KEY);
      refreshNotifications();
      showToast(
        `Thanh toán thành công! Đơn hàng #${orderId} đang được xử lý.`,
        "success",
        "Thanh toán thành công"
      );
      setTimeout(() => router.push("/"), 1500);
    }
  }, [payStatus, orderId, router, qc, refreshNotifications, showToast]);

  const noteContent = cfg.noteFormat.replace("[Họ tên]", "").replace("[Tên sản phẩm]", "Đơn #" + orderId).trim();

  if (payStatus === "confirmed") {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <Stack alignItems="center" spacing={2}>
            <CheckCircleIcon sx={{ fontSize: 80, color: "#4caf50" }} />
            <Typography variant="h6" fontWeight={700}>Thanh toán đã xác nhận!</Typography>
            <Typography color="text.secondary">Đang chuyển hướng...</Typography>
            <CircularProgress sx={{ color: "#4caf50" }} size={28} />
          </Stack>
        </motion.div>
      </Box>
    );
  }

  if (payStatus === "failed") {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Stack alignItems="center" spacing={2}>
            <CancelIcon sx={{ fontSize: 80, color: "#f44336" }} />
            <Typography variant="h6" fontWeight={700}>Thanh toán thất bại</Typography>
            <Button variant="contained" onClick={() => router.push("/cart")}
              sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" } }}>
              Quay lại giỏ hàng
            </Button>
          </Stack>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4, px: 2 }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            {/* Header */}
            <Stack alignItems="center" spacing={1} mb={2}>
              <Typography variant="h5" fontWeight={700}>
                Thanh toán qua {method === "VNPAY" ? "VNPay" : "MoMo"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đơn hàng <strong>#{orderId}</strong>
              </Typography>
            </Stack>

            {/* Số tiền */}
            <Box sx={{ bgcolor: "#fff8f0", border: "1px solid #ffe0c0", borderRadius: 2, p: 2, mb: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">Số tiền cần thanh toán</Typography>
              <Typography variant="h4" fontWeight={700} color="#f25c05">
                {amount ? amount.toLocaleString("vi-VN") + "₫" : "Theo giá trị đơn hàng"}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* QR Code */}
            <Typography variant="body2" textAlign="center" mb={2} color="text.secondary">
              Quét mã QR bằng ứng dụng {method === "VNPAY" ? "ngân hàng/VNPay" : "MoMo"} để thanh toán
            </Typography>

            {isLoading ? (
              <Skeleton variant="rounded" height={260} sx={{ mx: "auto", maxWidth: 260, mb: 2 }} />
            ) : (
              <Box display="flex" justifyContent="center" mb={2}>
                <Image
                  src={cfg.qrSrc}
                  alt={`QR ${method}`}
                  width={260}
                  height={260}
                  style={{ borderRadius: 8, border: "1px solid #e0e0e0" }}
                  priority
                />
              </Box>
            )}

            {/* Thông tin tài khoản */}
            <Stack spacing={1} mb={3}>
              <Typography variant="body2">
                <strong>Chủ tài khoản:</strong> {cfg.ownerName}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2">
                  <strong>Số {method === "VNPAY" ? "tài khoản" : "điện thoại MoMo"}:</strong> {cfg.phone}
                </Typography>
                <Tooltip title={copied === "phone" ? "Đã sao chép!" : "Sao chép"}>
                  <Button size="small" variant="text" sx={{ minWidth: 0, p: 0.5 }}
                    onClick={() => copy(cfg.phone.replaceAll(" ", ""), "phone")}>
                    <ContentCopyIcon fontSize="small" />
                  </Button>
                </Tooltip>
              </Stack>
              <Typography variant="body2">
                <strong>Thời hạn thanh toán:</strong> {cfg.validWithinMins} phút kể từ lúc đặt
              </Typography>
            </Stack>

            {/* Nội dung chuyển khoản */}
            <Box sx={{ bgcolor: "#f0f4ff", borderLeft: "4px solid #3f51b5", p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="body2" fontWeight={600} mb={0.5}>Nội dung chuyển khoản:</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2">
                  <strong>{orderId ? `Thanh toan don ${orderId}` : cfg.noteFormat}</strong>
                </Typography>
                <Tooltip title={copied === "note" ? "Đã sao chép!" : "Sao chép"}>
                  <Button size="small" variant="text" sx={{ minWidth: 0, p: 0.5 }}
                    onClick={() => copy(orderId ? `Thanh toan don ${orderId}` : noteContent, "note")}>
                    <ContentCopyIcon fontSize="small" />
                  </Button>
                </Tooltip>
              </Stack>
            </Box>

            {/* Nút mở app thanh toán */}
            {externalUrl && (
              <Button
                fullWidth
                variant="contained"
                endIcon={<OpenInNewIcon />}
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mb: 2,
                  bgcolor: method === "VNPAY" ? "#0066cc" : "#ae2070",
                  "&:hover": { bgcolor: method === "VNPAY" ? "#0052a3" : "#8c1a5a" },
                  fontWeight: 600,
                  py: 1.3,
                }}
              >
                Mở ứng dụng {method === "VNPAY" ? "VNPay" : "MoMo"} để thanh toán
              </Button>
            )}

            {/* Polling indicator */}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              <CircularProgress size={16} sx={{ color: "#aaa" }} />
              <Typography variant="caption" color="text.secondary">
                Đang chờ xác nhận thanh toán tự động...
              </Typography>
            </Stack>

            <Button
              fullWidth
              variant="text"
              onClick={() => router.push("/cart")}
              sx={{ mt: 1.5, color: "text.secondary" }}
            >
              Huỷ và quay lại giỏ hàng
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default function PaymentPendingView() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress sx={{ color: "#f25c05" }} />
        </Box>
      }
    >
      <PendingContent />
    </Suspense>
  );
}
