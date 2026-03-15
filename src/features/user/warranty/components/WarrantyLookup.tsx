// warranty/components/WarrantyLookup.tsx
"use client";

import { useState } from "react";
import {
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
import { motion } from "framer-motion";
import { lookupWarranty } from "../api";

export default function WarrantyLookup() {
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [warrantyInfo, setWarrantyInfo] = useState<any>(null);

  const handleLookup = async () => {
    if (!orderCode) return;
    setLoading(true);
    try {
      const result = await lookupWarranty(orderCode);
      setWarrantyInfo(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
            placeholder="Nhập mã đơn hàng"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            size="medium"
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleLookup}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <SearchIcon />
            }
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

        {warrantyInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} gutterBottom>
              Kết quả tra cứu
            </Typography>

            <Stack spacing={2}>
              {warrantyInfo.items.map((item: any, idx: number) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography fontWeight={600}>
                        {item.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mua ngày: {item.purchaseDate}
                      </Typography>
                    </Box>
                    <Chip
                      icon={
                        item.status === "active" ? (
                          <CheckCircleIcon />
                        ) : (
                          <HistoryIcon />
                        )
                      }
                      label={
                        item.status === "active"
                          ? "Còn bảo hành"
                          : "Hết bảo hành"
                      }
                      color={item.status === "active" ? "success" : "default"}
                    />
                  </Stack>
                  {item.status === "active" && (
                    <Box mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        Hạn bảo hành: {item.expiryDate}
                      </Typography>
                    </Box>
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
