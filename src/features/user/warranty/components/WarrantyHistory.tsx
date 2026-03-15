// warranty/components/WarrantyHistory.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getUserWarrantyRequests } from "../api";

export default function WarrantyHistory() {
  const [requests, setRequests] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getUserWarrantyRequests();
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (!requests.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Box sx={{ my: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <HistoryIcon sx={{ color: "#0d47a1" }} />
          <Typography variant="h5" fontWeight={800} color="#333">
            Lịch sử yêu cầu bảo hành
          </Typography>
        </Stack>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Mã yêu cầu</TableCell>
                <TableCell>Ngày gửi</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req: any) => (
                <TableRow key={req.id} hover>
                  <TableCell>#{req.code}</TableCell>
                  <TableCell>{req.createdAt}</TableCell>
                  <TableCell>{req.productName}</TableCell>
                  <TableCell>
                    <Chip
                      label={req.status}
                      size="small"
                      color={
                        req.status === "Hoàn thành"
                          ? "success"
                          : req.status === "Đang xử lý"
                            ? "warning"
                            : "default"
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => window.open(`/warranty/${req.id}`)}
                    >
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </motion.div>
  );
}
