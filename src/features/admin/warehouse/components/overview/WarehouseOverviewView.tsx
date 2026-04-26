"use client";

import {
  Box, Card, CardContent, CardHeader, Chip, CircularProgress,
  Divider, MenuItem, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
  Paper, Grid,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmberOutlined";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { useState } from "react";
import { useWarehouses, useWarehouseStats, useInventory } from "../../queries";
import type { InventoryRow } from "../../types";

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h5" fontWeight={700} mt={0.5}>{value}</Typography>
          </Box>
          <Box
            sx={{
              width: 48, height: 48, borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
              bgcolor: `${color}18`, color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Stock status chip ────────────────────────────────────────────────────────

function StockStatusChip({ row }: { row: InventoryRow }) {
  if (row.quantity === 0)
    return <Chip label="Hết hàng" color="error" size="small" />;
  if (row.quantity <= row.minQuantity)
    return <Chip label="Sắp hết" color="warning" size="small" />;
  return <Chip label="Còn hàng" color="success" size="small" />;
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function WarehouseOverviewView() {
  const { data: stats, isLoading: statsLoading } = useWarehouseStats();
  const { data: warehouses = [] } = useWarehouses();

  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [lowStock, setLowStock] = useState<boolean | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  const handleSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout((handleSearchChange as any)._t);
    (handleSearchChange as any)._t = setTimeout(() => setDebouncedSearch(val), 300);
  };

  const { data, isLoading: invLoading } = useInventory({
    warehouseId: warehouseId || undefined,
    lowStock,
    search: debouncedSearch || undefined,
    page: 1,
    size: 50,
  });

  const inventory = data?.result ?? [];

  return (
    <Box>
      {/* Stat cards */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Tổng SKU"
            value={statsLoading ? "..." : (stats?.totalSkus ?? 0).toLocaleString("vi-VN")}
            icon={<InventoryIcon />}
            color="#6366f1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Giá trị tồn kho"
            value={statsLoading ? "..." : `${(stats?.totalInventoryValue ?? 0).toLocaleString("vi-VN")}₫`}
            icon={<AttachMoneyIcon />}
            color="#10b981"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Sắp hết hàng"
            value={statsLoading ? "..." : (stats?.lowStockCount ?? 0).toLocaleString("vi-VN")}
            icon={<WarningAmberIcon />}
            color="#f59e0b"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Hết hàng"
            value={statsLoading ? "..." : (stats?.outOfStockCount ?? 0).toLocaleString("vi-VN")}
            icon={<RemoveShoppingCartIcon />}
            color="#ef4444"
          />
        </Grid>
      </Grid>

      {/* Inventory table */}
      <Card>
        <CardHeader title="Tồn kho chi tiết" />
        <Divider />

        {/* Filters */}
        <CardContent sx={{ pb: 1 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end">
            <TextField
              select size="small" label="Kho" sx={{ minWidth: 180 }}
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value ? Number(e.target.value) : "")}
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
              <MenuItem value="">Tất cả kho</MenuItem>
              {warehouses.map((w) => (
                <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              select size="small" label="Trạng thái tồn" sx={{ minWidth: 160 }}
              value={lowStock === undefined ? "" : String(lowStock)}
              onChange={(e) => {
                const v = e.target.value;
                setLowStock(v === "" ? undefined : v === "true");
              }}
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="true">Sắp hết hàng</MenuItem>
            </TextField>

            <TextField
              size="small" label="Tìm sản phẩm" sx={{ minWidth: 220 }}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </Stack>
        </CardContent>

        <TableContainer component={Paper} variant="outlined" sx={{ mx: 2, mb: 2, borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Variant</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Kho</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Tồn kho</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Giá vốn (₫)</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Giá trị (₫)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invLoading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!invLoading && inventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              )}

              {!invLoading && inventory.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.variantDesc ?? "—"}</TableCell>
                  <TableCell>{row.warehouseName}</TableCell>
                  <TableCell align="right">{row.quantity.toLocaleString("vi-VN")}</TableCell>
                  <TableCell align="right">{row.costPrice.toLocaleString("vi-VN")}</TableCell>
                  <TableCell align="right">{row.inventoryValue.toLocaleString("vi-VN")}</TableCell>
                  <TableCell><StockStatusChip row={row} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
