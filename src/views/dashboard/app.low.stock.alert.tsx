"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

interface LowStockProduct {
  id: number;
  name: string;
  imageAvt: string;
  pricePerUnit: number;
  stockQuantity: number;
}

const THRESHOLD = 10;

const formatCurrency = (v: number) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const LowStockAlert = () => {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const data = await api.get<LowStockProduct[]>(
          `/api/v1/dashboard/overview/low-stock?threshold=${THRESHOLD}`,
          { signal: controller.signal }
        );
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        logIfNotCanceled(err, "LowStockAlert fetch error:");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Alert
        severity="warning"
        icon={<WarningAmberIcon />}
        action={
          <IconButton size="small" onClick={() => setExpanded((v) => !v)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
        sx={{ cursor: "pointer" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={600}>
            Cảnh báo tồn kho thấp
          </Typography>
          <Chip
            label={`${products.length} sản phẩm`}
            color="warning"
            size="small"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
          <Typography variant="body2" color="text.secondary">
            — tồn kho ≤ {THRESHOLD} đơn vị
          </Typography>
        </Stack>
      </Alert>

      <Collapse in={expanded} unmountOnExit>
        <TableContainer
          sx={{
            border: "1px solid",
            borderColor: "warning.light",
            borderTop: 0,
            borderRadius: "0 0 8px 8px",
            bgcolor: "background.paper",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "warning.lighter" }}>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Giá</TableCell>
                <TableCell align="right">Tồn kho</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {p.imageAvt && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imageAvt}
                          alt={p.name}
                          style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
                        />
                      )}
                      <Typography variant="body2">{p.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatCurrency(p.pricePerUnit)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={p.stockQuantity === 0 ? "Hết hàng" : `Còn ${p.stockQuantity}`}
                      color={p.stockQuantity === 0 ? "error" : "warning"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};

export default LowStockAlert;
