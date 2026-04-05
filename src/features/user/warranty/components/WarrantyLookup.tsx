// warranty/components/WarrantyLookup.tsx
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
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

export default function WarrantyLookup() {
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [warrantyInfo, setWarrantyInfo] = useState<{
    orderCode: string;
    items: WarrantyItem[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!orderCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await lookupWarranty(orderCode.trim());
      setWarrantyInfo(result);
    } catch (err: any) {
      setError(err?.message ?? "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã.");
      setWarrantyInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLookup();
  };

  return (
    <Box sx={{ my: 6 }} id="warranty-lookup">
      <Typography variant="h4" fontWeight={800} color="#333" gutterBottom>
        Tra cứu bảo hành
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Nhập mã đơn hàng để kiểm tra tình trạng bảo hành
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            placeholder="VD: ORD-20240315-00001"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            onKeyDown={handleKeyDown}
            size="medium"
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleLookup}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            sx={{
              bgcolor: "#0d47a1",
              color: "#fff",
              minWidth: 180,
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            Tra cứu
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {warrantyInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} gutterBottom>
              Mã đơn:{" "}
              <Box component="span" sx={{ fontFamily: "monospace", color: "#0d47a1" }}>
                {warrantyInfo.orderCode}
              </Box>
            </Typography>

            <Stack spacing={2}>
              {warrantyInfo.items.map((item, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                    spacing={1}
                  >
                    <Box>
                      <Typography fontWeight={600}>{item.productName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bảo hành: {item.warrantyMonths} tháng
                      </Typography>
                      {(item.deliveredAt ?? item.orderDate) && (
                        <Typography variant="body2" color="text.secondary">
                          {item.deliveredAt
                            ? `Ngày nhận hàng: ${fmtDate(item.deliveredAt)}`
                            : `Ngày đặt hàng: ${fmtDate(item.orderDate)}`}
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {/* Trạng thái bảo hành */}
                      <Chip
                        icon={item.validWarranty ? <CheckCircleIcon /> : <ErrorOutlineIcon />}
                        label={item.validWarranty ? "Còn bảo hành" : "Hết bảo hành"}
                        color={item.validWarranty ? "success" : "default"}
                        size="small"
                      />
                      {/* Trạng thái claim (nếu có) */}
                      {item.status && (
                        <Chip
                          icon={<HistoryIcon />}
                          label={claimStatusLabel[item.status] ?? item.status}
                          color={
                            item.status === "APPROVED"
                              ? "success"
                              : item.status === "REJECTED"
                              ? "error"
                              : item.status === "PENDING"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      )}
                    </Stack>
                  </Stack>

                  {item.warrantyExpiry && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      Hạn bảo hành đến: {fmtDate(item.warrantyExpiry)}
                    </Typography>
                  )}
                  {item.claimCode && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Mã yêu cầu: <Box component="span" sx={{ fontFamily: "monospace" }}>{item.claimCode}</Box>
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          </motion.div>
        )}
      </Paper>
    </Box>
  );
}
