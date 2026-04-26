"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPaymentStatus } from "./api";

const MB_BANK = {
  name: "MB Bank – Ngân hàng Quân Đội",
  accountNumber: "0800104315301",
  accountName: "NGUYEN HUY CAO",
};

interface Props {
  orderId: number;
}

export default function BankTransferView({ orderId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<{ orderCode: string; amount: number } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    getPaymentStatus(orderId)
      .then((s) => setOrderInfo({ orderCode: s.orderCode, amount: s.paidAmount ?? 0 }))
      .catch(() => setOrderInfo({ orderCode: `DH${orderId}`, amount: 0 }))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress sx={{ color: "#003087" }} />
      </Box>
    );
  }

  return (
    <Box maxWidth={520} mx="auto" py={4} px={2}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#003087",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccountBalanceIcon sx={{ color: "#fff", fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
            Thanh toán chuyển khoản
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đơn hàng #{orderInfo?.orderCode}
          </Typography>
        </Box>
      </Stack>

      <Alert severity="info" sx={{ mb: 3, fontSize: 13 }}>
        Chuyển khoản đúng <strong>số tiền</strong> và <strong>nội dung</strong> để đơn hàng được xác nhận nhanh nhất.
      </Alert>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* QR Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #003087 0%, #0050c8 100%)",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="rgba(255,255,255,0.85)" mb={2}>
            Quét QR bằng MB Bank hoặc ứng dụng ngân hàng bất kỳ
          </Typography>

          <Box
            sx={{
              display: "inline-block",
              bgcolor: "#fff",
              p: 1.5,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          >
            <Image
              src="/images/payment/mb-bank-qr.png"
              alt="QR chuyển khoản MB Bank"
              width={200}
              height={200}
              style={{ display: "block", borderRadius: 4 }}
              priority
            />
          </Box>

          <Chip
            label={`Đơn hàng #${orderInfo?.orderCode}`}
            sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700 }}
          />
        </Box>

        {/* Payment Info */}
        <Box p={3}>
          {/* Amount */}
          {!!orderInfo?.amount && (
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
                  {orderInfo.amount.toLocaleString("vi-VN")}₫
                </Typography>
                <Tooltip title={copied === "amount" ? "Đã sao chép!" : "Sao chép"}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(String(orderInfo?.amount ?? ""), "amount")}
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
          )}

          {/* Transfer content — critical */}
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
                {orderInfo?.orderCode}
              </Typography>
              <Tooltip title={copied === "content" ? "Đã sao chép!" : "Sao chép nội dung"}>
                <IconButton onClick={() => handleCopy(orderInfo?.orderCode ?? "", "content")}>
                  {copied === "content" ? (
                    <CheckCircleIcon sx={{ color: "#4caf50" }} />
                  ) : (
                    <ContentCopyIcon sx={{ color: "#f25c05" }} />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography variant="caption" color="error.main" fontWeight={600}>
              ⚠ Ghi đúng nội dung để chúng tôi xác nhận đơn nhanh nhất.
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Account details */}
          <Stack spacing={1.5} mb={2.5}>
            <InfoRow
              label="Ngân hàng"
              value={MB_BANK.name}
              field="bank"
              copied={copied}
              onCopy={handleCopy}
            />
            <InfoRow
              label="Số tài khoản"
              value={MB_BANK.accountNumber}
              field="account"
              copied={copied}
              onCopy={handleCopy}
            />
            <InfoRow
              label="Tên tài khoản"
              value={MB_BANK.accountName}
              field="name"
              copied={copied}
              onCopy={handleCopy}
            />
          </Stack>

          {/* Bank info card image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Image
              src="/images/payment/mb-bank-info.png"
              alt="Thông tin tài khoản MB Bank"
              width={260}
              height={74}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Actions */}
      <Stack spacing={1.5} mt={3}>
        <Alert severity="success" sx={{ fontSize: 13 }}>
          Sau khi chuyển khoản, đơn hàng sẽ được xác nhận trong <strong>1–2 giờ</strong> làm việc.
          Bạn sẽ nhận thông báo qua hệ thống.
        </Alert>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => router.push("/order")}
          sx={{
            bgcolor: "#f25c05",
            "&:hover": { bgcolor: "#e64a19" },
            fontWeight: 700,
            borderRadius: 2,
            py: 1.5,
          }}
        >
          Đã chuyển khoản – Xem đơn hàng của tôi
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push("/")}
          sx={{ borderRadius: 2 }}
        >
          Về trang chủ
        </Button>
      </Stack>
    </Box>
  );
}

function InfoRow({
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
