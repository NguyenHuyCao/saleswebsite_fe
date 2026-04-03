"use client";

import { useMemo, useState, ChangeEvent } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import { useProducts, Mutations } from "../queries";
import type { Product, ProductType } from "../types";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

/* ── Styled tooltip ─────────────────────────────────────────────── */
const LightTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#fff",
    color: "rgba(0,0,0,.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

/* ── Product type display ───────────────────────────────────────── */
const TYPE_META: Record<ProductType, { label: string; color: "primary" | "secondary" | "default" | "warning" }> = {
  MACHINE:   { label: "Máy móc",    color: "primary" },
  CLOTHING:  { label: "Quần áo",    color: "secondary" },
  ACCESSORY: { label: "Phụ kiện",   color: "warning" },
  OTHER:     { label: "Khác",       color: "default" },
};

/* ── Stat card ──────────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Card sx={{ flex: 1, minWidth: 160 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "16px !important" }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}20`, color, display: "flex" }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

/* ── Export helpers ─────────────────────────────────────────────── */
function exportCSV(rows: Product[]) {
  const headers = ["ID", "Tên sản phẩm", "Loại", "Danh mục", "Thương hiệu", "Tồn kho", "Giá bán", "Trạng thái"];
  const lines = rows.map((p) => [
    p.id,
    `"${p.name}"`,
    p.productType ?? "MACHINE",
    `"${p.categoryName ?? ""}"`,
    `"${p.brandName ?? ""}"`,
    p.stockQuantity ?? 0,
    p.price ?? 0,
    p.active ? "Hoạt động" : "Ngừng",
  ].join(","));
  const blob = new Blob(["\uFEFF" + [headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `products_${Date.now()}.csv`;
  a.click();
}

async function exportExcel(rows: Product[]) {
  const { utils, writeFile } = await import("xlsx");
  const ws = utils.json_to_sheet(
    rows.map((p) => ({
      ID: p.id,
      "Tên sản phẩm": p.name,
      "Loại SP": p.productType ?? "MACHINE",
      "Danh mục": p.categoryName ?? "",
      "Thương hiệu": p.brandName ?? "",
      "Tồn kho": p.stockQuantity ?? 0,
      "Giá bán (VND)": p.price ?? 0,
      "Giá gốc (VND)": p.costPrice ?? 0,
      "Bảo hành (tháng)": p.warrantyMonths ?? 0,
      "Trạng thái": p.active ? "Hoạt động" : "Ngừng",
    }))
  );
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Sản phẩm");
  writeFile(wb, `products_${Date.now()}.xlsx`);
}

function exportPDF(rows: Product[]) {
  const win = window.open("", "_blank")!;
  win.document.write(`
    <html><head><meta charset="UTF-8"><title>Danh sách sản phẩm</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }
      h2 { color: #333; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th { background: #1976d2; color: #fff; padding: 6px 8px; text-align: left; }
      td { border: 1px solid #ddd; padding: 5px 8px; }
      tr:nth-child(even) { background: #f5f5f5; }
    </style></head><body>
    <h2>Danh sách sản phẩm — ${new Date().toLocaleDateString("vi-VN")}</h2>
    <table>
      <thead><tr>
        <th>ID</th><th>Tên sản phẩm</th><th>Loại</th><th>Thương hiệu</th>
        <th>Tồn kho</th><th>Giá bán</th><th>Trạng thái</th>
      </tr></thead>
      <tbody>
        ${rows.map((p) => `<tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.productType ?? "MACHINE"}</td>
          <td>${p.brandName ?? "-"}</td>
          <td>${p.stockQuantity ?? 0}</td>
          <td>${(p.price ?? 0).toLocaleString("vi-VN")}₫</td>
          <td>${p.active ? "Hoạt động" : "Ngừng"}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    </body></html>
  `);
  win.document.close();
  win.print();
}

/* ── Main component ─────────────────────────────────────────────── */
export default function ProductTable() {
  const router = useRouter();
  const { data, loading, error, refetch } = useProducts();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [toast, setToast] = useState({ open: false, message: "", type: "success" as "success" | "error" });
  const showToast = (message: string, type: "success" | "error") => setToast({ open: true, message, type });

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Export menu
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  const keyword = useSelector((s: AppState) => s.search.keyword.trim().toLowerCase());
  const products = data?.result ?? [];

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((p) => p.active).length,
    inactive: products.filter((p) => !p.active).length,
    lowStock: products.filter((p) => (p.stockQuantity ?? 0) <= 5).length,
  }), [products]);

  /* ── Filtered ── */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const kw = [p.name, p.brandName ?? "", p.categoryName ?? "", String(p.id)]
        .some((v) => v.toLowerCase().includes(keyword));
      const type = !typeFilter || (p.productType ?? "MACHINE") === typeFilter;
      const status = !statusFilter || (statusFilter === "active" ? p.active : !p.active);
      let price = true;
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        price = (p.price ?? 0) >= min && (p.price ?? 0) <= max;
      }
      return kw && type && status && price;
    });
  }, [products, keyword, typeFilter, statusFilter, priceRange]);

  /* ── Handlers ── */
  const onToggle = async (slug: string) => {
    try {
      await Mutations.toggleActive(slug);
      showToast("Cập nhật trạng thái thành công!", "success");
      await refetch();
    } catch (e: any) {
      showToast(e.message || "Cập nhật trạng thái thất bại!", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await Mutations.deleteProduct(deleteTarget.id);
      showToast(`Đã xóa sản phẩm "${deleteTarget.name}"`, "success");
      await refetch();
    } catch (e: any) {
      showToast(e.message || "Xóa sản phẩm thất bại!", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      {/* ── Stat cards ── */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <StatCard icon={<InventoryOutlinedIcon />}          label="Tổng sản phẩm"  value={stats.total}    color="#1976d2" />
        <StatCard icon={<CheckCircleOutlineIcon />}         label="Đang hoạt động" value={stats.active}   color="#2e7d32" />
        <StatCard icon={<DoNotDisturbAltOutlinedIcon />}    label="Ngừng hoạt động" value={stats.inactive} color="#757575" />
        <StatCard icon={<WarningAmberOutlinedIcon />}       label="Sắp hết hàng (≤5)" value={stats.lowStock} color="#ed6c02" />
      </Box>

      <Card>
        <CardHeader
          title="Danh sách sản phẩm"
          titleTypographyProps={{ variant: "h6" }}
          action={
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadOutlinedIcon />}
                onClick={(e) => setExportAnchor(e.currentTarget)}
                size="small"
              >
                Xuất file
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/admin/products/create")}
                size="small"
              >
                Thêm sản phẩm
              </Button>
            </Box>
          }
        />

        <Divider />

        <CardContent>
          {/* Filters */}
          <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
            <TextField
              select label="Loại sản phẩm" size="small" sx={{ minWidth: 150 }}
              SelectProps={{ native: true }}
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">Tất cả loại</option>
              <option value="MACHINE">Máy móc</option>
              <option value="CLOTHING">Quần áo</option>
              <option value="ACCESSORY">Phụ kiện</option>
              <option value="OTHER">Khác</option>
            </TextField>

            <TextField
              select label="Trạng thái" size="small" sx={{ minWidth: 140 }}
              SelectProps={{ native: true }}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng</option>
            </TextField>

            <TextField
              select label="Khoảng giá" size="small" sx={{ minWidth: 150 }}
              SelectProps={{ native: true }}
              value={priceRange}
              onChange={(e) => { setPriceRange(e.target.value); setPage(0); }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">Tất cả</option>
              <option value="0-1000000">Dưới 1 triệu</option>
              <option value="1000000-5000000">1 - 5 triệu</option>
              <option value="5000000-10000000">5 - 10 triệu</option>
              <option value="10000000-999999999">Trên 10 triệu</option>
            </TextField>
          </Box>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {["ID", "Sản phẩm", "Loại", "Thương hiệu", "Tồn kho", "Giá bán", "Trạng thái", "Thao tác"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <TableCell key={j}><Skeleton variant="text" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    : paginated.map((p: Product) => {
                        const typeMeta = TYPE_META[p.productType ?? "MACHINE"];
                        return (
                          <TableRow hover key={p.id}>
                            <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>{p.id}</TableCell>

                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1.5}>
                                <Avatar
                                  src={typeof p.imageAvt === "string" ? p.imageAvt : ""}
                                  alt={p.name}
                                  variant="rounded"
                                  sx={{ width: 40, height: 40 }}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight={600} noWrap maxWidth={180} title={p.name}>
                                    {p.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" noWrap maxWidth={180}>
                                    {p.categoryName ?? "-"}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={typeMeta.label}
                                color={typeMeta.color}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2">{p.brandName ?? "-"}</Typography>
                            </TableCell>

                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color={(p.stockQuantity ?? 0) <= 5 ? "error" : "text.primary"}
                                fontWeight={(p.stockQuantity ?? 0) <= 5 ? 700 : 400}
                              >
                                {p.stockQuantity ?? 0}
                              </Typography>
                            </TableCell>

                            <TableCell align="right">
                              <Typography variant="body2">
                                {(p.price ?? 0).toLocaleString("vi-VN")}₫
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={p.active ? "Hoạt động" : "Ngừng"}
                                color={p.active ? "success" : "default"}
                                size="small"
                                onClick={() => onToggle(p.slug)}
                                sx={{ cursor: "pointer", fontWeight: 600 }}
                              />
                            </TableCell>

                            <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                              <Box display="flex">
                                <LightTooltip title="Xem chi tiết">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => router.push(`/admin/products/view?productSlug=${p.slug}`)}
                                  >
                                    <PreviewOutlinedIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </LightTooltip>
                                <LightTooltip title="Cập nhật">
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => router.push(`/admin/products/update?productSlug=${p.slug}`)}
                                  >
                                    <EditIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </LightTooltip>
                                <LightTooltip title="Xóa">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setDeleteTarget(p)}
                                  >
                                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </LightTooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                  {!loading && filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">Không tìm thấy sản phẩm</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end">
              <TablePagination
                component="div"
                count={filtered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_e, p) => setPage(p)}
                onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setRowsPerPage(+e.target.value);
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Hiển thị"
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              />
            </Box>
          </Paper>
        </CardContent>
      </Card>

      {/* ── Export menu ── */}
      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={() => setExportAnchor(null)}
        disableScrollLock
      >
        <MenuItem onClick={() => { exportCSV(filtered); setExportAnchor(null); }}>
          Xuất CSV
        </MenuItem>
        <MenuItem onClick={() => { exportExcel(filtered); setExportAnchor(null); }}>
          Xuất Excel (.xlsx)
        </MenuItem>
        <MenuItem onClick={() => { exportPDF(filtered); setExportAnchor(null); }}>
          Xuất PDF (In)
        </MenuItem>
      </Menu>

      {/* ── Delete confirm dialog ── */}
      <Dialog open={Boolean(deleteTarget)} onClose={deleting ? undefined : () => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600}>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa sản phẩm{" "}
            <strong>"{deleteTarget?.name}"</strong>?
            <br />
            <Typography component="span" variant="caption" color="error">
              Hành động này không thể hoàn tác. Sản phẩm có đơn hàng hoặc khuyến mãi sẽ không thể xóa.
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} variant="outlined" disabled={deleting}>
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={deleting}>
            {deleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}
