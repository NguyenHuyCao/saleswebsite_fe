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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
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
import { useProducts, Mutations, Catalog } from "../queries";
import type { Product, ProductType } from "../types";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

/* ── Styled tooltip ─────────────────────────────────────────────── */
const LightTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
    fontSize: 11,
    border: `1px solid ${theme.palette.divider}`,
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
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.selected", color, display: "flex" }}>
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

/* ── Constants ──────────────────────────────────────────────────── */
const TYPE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  { value: "MACHINE",   label: "Máy móc" },
  { value: "CLOTHING",  label: "Quần áo" },
  { value: "ACCESSORY", label: "Phụ kiện" },
  { value: "OTHER",     label: "Khác" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active",   label: "Hoạt động" },
  { value: "inactive", label: "Ngừng" },
];

const PRICE_OPTIONS = [
  { value: "", label: "Tất cả khoảng giá" },
  { value: "0-1000000",         label: "Dưới 1 triệu" },
  { value: "1000000-5000000",   label: "1 – 5 triệu" },
  { value: "5000000-10000000",  label: "5 – 10 triệu" },
  { value: "10000000-999999999",label: "Trên 10 triệu" },
];

const STOCK_OPTIONS = [
  { value: "", label: "Tất cả tồn kho" },
  { value: "in_stock",    label: "Còn hàng (>0)" },
  { value: "low_stock",   label: "Sắp hết (1–9)" },
  { value: "out_of_stock",label: "Hết hàng (=0)" },
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Mới nhất" },
  { value: "oldest",     label: "Cũ nhất" },
  { value: "price_desc", label: "Giá cao → thấp" },
  { value: "price_asc",  label: "Giá thấp → cao" },
  { value: "stock_asc",  label: "Tồn kho thấp → cao" },
];

const labelOf = (opts: { value: string; label: string }[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

/* ── Main component ─────────────────────────────────────────────── */
export default function ProductTable() {
  const router = useRouter();
  const { data, loading, error, refetch } = useProducts();
  const categoriesData = Catalog.useCategories();
  const brandsData = Catalog.useBrands();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [toast, setToast] = useState({ open: false, message: "", type: "success" as "success" | "error" });
  const showToast = (message: string, type: "success" | "error") => setToast({ open: true, message, type });

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Export menu
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  const keyword = useSelector((s: AppState) => s.search.keyword.trim().toLowerCase());
  const products = data?.result ?? [];
  const categoryOptions = (categoriesData ?? []) as { id: number; name: string }[];
  const brandOptions = (brandsData ?? []) as { id: number; name: string }[];

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((p) => p.active).length,
    inactive: products.filter((p) => !p.active).length,
    lowStock: products.filter((p) => (p.stockQuantity ?? 0) <= 5).length,
  }), [products]);

  const hasFilter =
    Boolean(typeFilter) || Boolean(categoryFilter) || Boolean(brandFilter) ||
    Boolean(priceRange) || Boolean(stockFilter) || Boolean(statusFilter);

  const clearFilters = () => {
    setTypeFilter("");
    setCategoryFilter("");
    setBrandFilter("");
    setPriceRange("");
    setStockFilter("");
    setStatusFilter("");
    setPage(0);
  };

  /* ── Filtered + Sorted ── */
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const kw = [p.name, p.brandName ?? "", p.categoryName ?? "", String(p.id)]
        .some((v) => v.toLowerCase().includes(keyword));
      const type   = !typeFilter     || (p.productType ?? "MACHINE") === typeFilter;
      const cat    = !categoryFilter || (p.categoryName ?? "") === categoryFilter;
      const brand  = !brandFilter    || (p.brandName ?? "") === brandFilter;
      const status = !statusFilter   || (statusFilter === "active" ? p.active : !p.active);
      let price = true;
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        price = (p.price ?? 0) >= min && (p.price ?? 0) <= max;
      }
      let stock = true;
      if (stockFilter === "in_stock")     stock = (p.stockQuantity ?? 0) > 0;
      if (stockFilter === "low_stock")    stock = (p.stockQuantity ?? 0) >= 1 && (p.stockQuantity ?? 0) <= 9;
      if (stockFilter === "out_of_stock") stock = (p.stockQuantity ?? 0) === 0;
      return kw && type && cat && brand && status && price && stock;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":     return (a.id ?? 0) - (b.id ?? 0);
        case "price_desc": return (b.price ?? 0) - (a.price ?? 0);
        case "price_asc":  return (a.price ?? 0) - (b.price ?? 0);
        case "stock_asc":  return (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0);
        default:           return (b.id ?? 0) - (a.id ?? 0); // newest
      }
    });
  }, [products, keyword, typeFilter, categoryFilter, brandFilter, statusFilter, priceRange, stockFilter, sortBy]);

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
        <StatCard icon={<InventoryOutlinedIcon />}          label="Tổng sản phẩm"     value={stats.total}    color="info.main" />
        <StatCard icon={<CheckCircleOutlineIcon />}         label="Đang hoạt động"    value={stats.active}   color="success.main" />
        <StatCard icon={<DoNotDisturbAltOutlinedIcon />}   label="Ngừng hoạt động"   value={stats.inactive} color="text.disabled" />
        <StatCard icon={<WarningAmberOutlinedIcon />}      label="Sắp hết hàng (≤5)" value={stats.lowStock} color="warning.main" />
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
          {/* Filter bar */}
          <Box sx={{ mb: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sắp xếp</InputLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sắp xếp" MenuProps={{ disableScrollLock: true }}>
                {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Loại sản phẩm</InputLabel>
              <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }} label="Loại sản phẩm" MenuProps={{ disableScrollLock: true }}>
                {TYPE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Danh mục</InputLabel>
              <Select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }} label="Danh mục" MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="">Tất cả danh mục</MenuItem>
                {categoryOptions.map((c) => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Thương hiệu</InputLabel>
              <Select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(0); }} label="Thương hiệu" MenuProps={{ disableScrollLock: true }}>
                <MenuItem value="">Tất cả thương hiệu</MenuItem>
                {brandOptions.map((b) => <MenuItem key={b.id} value={b.name}>{b.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} label="Trạng thái" MenuProps={{ disableScrollLock: true }}>
                {STATUS_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Khoảng giá</InputLabel>
              <Select value={priceRange} onChange={(e) => { setPriceRange(e.target.value); setPage(0); }} label="Khoảng giá" MenuProps={{ disableScrollLock: true }}>
                {PRICE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Tồn kho</InputLabel>
              <Select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(0); }} label="Tồn kho" MenuProps={{ disableScrollLock: true }}>
                {STOCK_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            {hasFilter && (
              <Button size="small" variant="outlined" color="error" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </Box>

          {/* Active filter chips */}
          {hasFilter && (
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1.5}>
              {typeFilter && <Chip label={`Loại: ${labelOf(TYPE_OPTIONS, typeFilter)}`} size="small" onDelete={() => { setTypeFilter(""); setPage(0); }} />}
              {categoryFilter && <Chip label={`Danh mục: ${categoryFilter}`} size="small" onDelete={() => { setCategoryFilter(""); setPage(0); }} />}
              {brandFilter && <Chip label={`Thương hiệu: ${brandFilter}`} size="small" onDelete={() => { setBrandFilter(""); setPage(0); }} />}
              {statusFilter && <Chip label={`Trạng thái: ${labelOf(STATUS_OPTIONS, statusFilter)}`} size="small" onDelete={() => { setStatusFilter(""); setPage(0); }} />}
              {priceRange && <Chip label={`Giá: ${labelOf(PRICE_OPTIONS, priceRange)}`} size="small" onDelete={() => { setPriceRange(""); setPage(0); }} />}
              {stockFilter && <Chip label={`Kho: ${labelOf(STOCK_OPTIONS, stockFilter)}`} size="small" onDelete={() => { setStockFilter(""); setPage(0); }} />}
            </Stack>
          )}

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
