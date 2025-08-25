"use client";

import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Button,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { MOMO_INFO } from "./constants";

export default function MomoPaymentView() {
  const [copied, setCopied] = useState<"phone" | "note" | null>(null);

  const copy = async (text: string, key: "phone" | "note") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  const downloadQR = async () => {
    // Cho phép người dùng tải ảnh QR (asset tĩnh)
    const a = document.createElement("a");
    a.href = MOMO_INFO.qrSrc;
    a.download = "momo_qr.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          maxWidth: 680,
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Thanh toán bằng MoMo
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" textAlign="center" mb={2}>
          Vui lòng quét mã QR bên dưới bằng ứng dụng MoMo để thanh toán.
        </Typography>

        <Box display="flex" justifyContent="center" mb={2}>
          <Image
            src={MOMO_INFO.qrSrc}
            alt="QR MoMo"
            width={300}
            height={300}
            style={{ borderRadius: 8, border: "1px solid #e0e0e0" }}
            priority
          />
        </Box>

        <Box display="flex" justifyContent="center" gap={1} mb={3}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadQR}
          >
            Tải QR
          </Button>
          <Tooltip
            title={copied === "phone" ? "Đã sao chép!" : "Sao chép số MoMo"}
          >
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={() => copy(MOMO_INFO.phone.replaceAll(" ", ""), "phone")}
            >
              Sao chép số
            </Button>
          </Tooltip>
        </Box>

        <Stack spacing={1.2} mb={3}>
          <Typography variant="body2">
            <strong>Chủ tài khoản:</strong> {MOMO_INFO.ownerName}
          </Typography>
          <Typography variant="body2">
            <strong>Số điện thoại MoMo:</strong> {MOMO_INFO.phone}
          </Typography>
          <Typography variant="body2">
            <strong>Số tiền:</strong> Theo giá trị đơn hàng
          </Typography>
          <Typography variant="body2">
            <strong>Thời gian hiệu lực:</strong> Trong vòng{" "}
            {MOMO_INFO.validWithinMins} phút kể từ lúc đặt hàng
          </Typography>
        </Stack>

        <Box
          sx={{
            backgroundColor: "#f0f4ff",
            borderLeft: "4px solid #3f51b5",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Lưu ý nội dung chuyển khoản:
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
            mt={1}
          >
            <Typography variant="body2">
              Vui lòng ghi đúng cú pháp: <strong>{MOMO_INFO.noteFormat}</strong>
            </Typography>
            <Tooltip
              title={copied === "note" ? "Đã sao chép!" : "Sao chép cú pháp"}
            >
              <Button
                size="small"
                variant="text"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={() => copy(MOMO_INFO.noteFormat, "note")}
              >
                Sao chép
              </Button>
            </Tooltip>
          </Stack>

          <Typography variant="body2" color="error" mt={1}>
            Ví dụ: <strong>Nguyen Van B - Tai nghe Sony WH-1000XM5</strong>
          </Typography>
        </Box>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={1.5}
          mt={3}
        >
          <CheckCircleOutlineIcon color="success" />
          <Typography variant="body2" color="text.secondary">
            Sau khi thanh toán thành công, đơn hàng sẽ được xác nhận tự động.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
