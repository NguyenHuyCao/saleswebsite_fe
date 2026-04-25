"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { motion } from "framer-motion";
import { lookupWarranty, type WarrantyItem } from "../api";

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("vi-VN") : "—";

const claimStatusLabel: Record<string, string> = {
  PENDING: "Đang chờ",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã huỷ",
};

const claimStatusColor = (s: string): "default" | "warning" | "success" | "error" => {
  switch (s.toUpperCase()) {
    case "APPROVED":  return "success";
    case "REJECTED":  return "error";
    case "PENDING":   return "warning";
    default:          return "default";
  }
};

const normStatus = (s?: string) => (s ?? "").toUpperCase();

export default function WarrantyLookup() {
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [warrantyInfo, setWarrantyInfo] = useState<{
    orderCode: string;
    items: WarrantyItem[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isBhCode = orderCode.trim().toUpperCase().startsWith("BH-");

  const handleLookup = async () => {
    const code = orderCode.trim();
    if (!code) return;

    if (code.toUpperCase().startsWith("BH-")) {
      setError(
        'Đây là mã yêu cầu bảo hành (BH-...), không phải mã đơn hàng. Vui lòng nhập mã đơn hàng bắt đầu bằng "ORD-", ví dụ: ORD-20240315-00001. Mã đơn hàng có trong email xác nhận đặt hàng hoặc trong trang "Đơn hàng của tôi".'
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await lookupWarranty(code);
      setWarrantyInfo(result);
    } catch (err: any) {
      setError(
        err?.message ??
          "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng."
      );
      setWarrantyInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ my: 5 }} id="warranty-lookup">
      <Typography variant="h5" fontWeight={800} color="#333" gutterBottom>
        Tra cứu bảo hành
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Nhập mã đơn hàng (ORD-...) để kiểm tra tình trạng bảo hành sản phẩm
      </Typography>

      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, borderColor: "#e0e0e0" }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            fullWidth
            size="small"
            placeholder="VD: ORD-20240315-00001"
            value={orderCode}
            onChange={(e) => {
              setOrderCode(e.target.value);
              setError(null);
              setWarrantyInfo(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <Button
            variant="contained"
            onClick={handleLookup}
            disabled={loading || !orderCode.trim()}
            startIcon={
              loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />
            }
            sx={{
              bgcolor: "#0d47a1",
              color: "#fff",
              minWidth: { xs: "100%", sm: 130 },
              borderRadius: 2,
              fontWeight: 700,
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            Tra cứu
          </Button>
        </Stack>

        {/* Hint for BH- code */}
        {isBhCode && !error && (
          <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1.5 }}>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: "warning.main", mt: "2px", flexShrink: 0 }} />
            <Typography variant="caption" color="warning.main">
              Bạn đang nhập mã yêu cầu bảo hành (BH-...). Tra cứu cần <strong>mã đơn hàng</strong> bắt đầu bằng <strong>ORD-</strong>.
            </Typography>
          </Stack>
        )}

        {/* Helper text */}
        {!error && !isBhCode && (
          <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 1 }}>
            Mã đơn hàng có dạng ORD-YYYYMMDD-XXXXX · Xem trong email xác nhận hoặc trang "Đơn hàng của tôi"
          </Typography>
        )}

        {error && (
          <Alert
            severity={isBhCode ? "warning" : "error"}
            icon={isBhCode ? <InfoOutlinedIcon /> : undefined}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {warrantyInfo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Divider sx={{ my: 2.5 }} />

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Mã đơn:
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ fontFamily: "monospace", color: "#0d47a1" }}
              >
                {warrantyInfo.orderCode}
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              {warrantyInfo.items.map((item, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2, borderColor: "#eeeeee" }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                    spacing={1}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        fontWeight={600}
                        variant="body2"
                        noWrap
                        sx={{ mb: 0.25 }}
                      >
                        {item.productName}
                      </Typography>
                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Typography variant="caption" color="text.secondary">
                          Bảo hành: {item.warrantyMonths} tháng
                        </Typography>
                        {(item.deliveredAt ?? item.orderDate) && (
                          <Typography variant="caption" color="text.secondary">
                            {item.deliveredAt
                              ? `Nhận hàng: ${fmtDate(item.deliveredAt)}`
                              : `Đặt hàng: ${fmtDate(item.orderDate)}`}
                          </Typography>
                        )}
                        {item.warrantyExpiry && (
                          <Typography variant="caption" color="text.secondary">
                            Hết hạn: {fmtDate(item.warrantyExpiry)}
                          </Typography>
                        )}
                      </Stack>
                      {item.claimCode && (
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          Mã yêu cầu:{" "}
                          <span style={{ fontFamily: "monospace" }}>
                            {item.claimCode}
                          </span>
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={0.75} flexWrap="wrap" justifyContent="flex-end">
                      <Chip
                        icon={
                          item.validWarranty ? (
                            <CheckCircleIcon sx={{ fontSize: "14px !important" }} />
                          ) : (
                            <ErrorOutlineIcon sx={{ fontSize: "14px !important" }} />
                          )
                        }
                        label={item.validWarranty ? "Còn bảo hành" : "Hết bảo hành"}
                        color={item.validWarranty ? "success" : "default"}
                        size="small"
                      />
                      {item.status && (
                        <Chip
                          icon={<HistoryIcon sx={{ fontSize: "14px !important" }} />}
                          label={
                            claimStatusLabel[normStatus(item.status)] ?? item.status
                          }
                          color={claimStatusColor(item.status)}
                          size="small"
                        />
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </motion.div>
        )}
      </Paper>
    </Box>
  );
}
