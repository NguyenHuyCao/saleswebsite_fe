"use client";

import { useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Switch,
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
import Grid from "@mui/material/Grid";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import BlockOutlined from "@mui/icons-material/BlockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import { useUsers, useToggleActive, useDeleteUser } from "../queries";
import type { User } from "../types";

const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

function avatarSrc(u: User) {
  if (!u.picture) return undefined;
  if (u.picture.startsWith("http")) return u.picture;
  return `${BACKEND}/storage/${u.picture}`;
}

type SnackState = { open: boolean; message: string; type: "success" | "error" };

/* ─── Sort options ───────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "newest", label: "Mới đăng ký" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "name_az", label: "Tên A → Z" },
  { value: "name_za", label: "Tên Z → A" },
];

/* ─── Export helpers ─────────────────────────────────────────────── */
function buildRows(users: User[]) {
  return users.map((u) => [
    u.id, u.username, u.email, u.phone ?? "", u.gender ?? "",
    u.role, u.provider,
    u.emailVerified ? "Đã xác thực" : "Chưa xác thực",
    u.active ? "Hoạt động" : "Bị khoá",
    u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "",
  ]);
}
const HEADERS = ["ID","Họ tên","Email","SĐT","Giới tính","Role","Provider","Email","Trạng thái","Ngày tham gia"];

function exportCSV(users: User[]) {
  const rows = buildRows(users);
  const csv = [HEADERS, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "users.csv"; a.click();
  URL.revokeObjectURL(url);
}

async function exportExcel(users: User[]) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...buildRows(users)]);
  ws["!cols"] = HEADERS.map((_, i) => ({ wch: i === 2 ? 30 : 18 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  XLSX.writeFile(wb, "users.xlsx");
}

function exportPDF(users: User[]) {
  const rows = buildRows(users);
  const win = window.open("", "_blank")!;
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>Danh sách người dùng</title>
    <style>body{font-family:Arial,sans-serif;font-size:12px}
    table{width:100%;border-collapse:collapse}
    th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}
    th{background:#1976d2;color:#fff}tr:nth-child(even){background:#f5f5f5}
    @media print{@page{size:A4 landscape}}</style></head><body>
    <h2 style="margin-bottom:12px">Danh sách người dùng</h2>
    <table><thead><tr>${HEADERS.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function UserTablePage({ onEdit }: { onEdit: (user: User) => void }) {
  const { data = [], isLoading } = useUsers();
  const toggleActive = useToggleActive();
  const deleteUser  = useDeleteUser();

  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snack, setSnack]             = useState<SnackState>({ open: false, message: "", type: "success" });
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const exportBtnRef                    = useRef<HTMLButtonElement>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  /* Filters */
  const [roleFilter,   setRoleFilter]   = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [sortBy,       setSortBy]       = useState("newest");

  const keyword = useSelector((s: AppState) => s.search.keyword.trim().toLowerCase());

  const hasFilter = Boolean(roleFilter) || Boolean(activeFilter);

  const clearFilters = () => {
    setRoleFilter("");
    setActiveFilter("");
    setPage(0);
  };

  /* Filtered + sorted */
  const filtered = useMemo(() => {
    let result = data.filter((u) => {
      const kw =
        u.username.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        (u.phone ?? "").toLowerCase().includes(keyword);
      const role   = !roleFilter   || u.role === roleFilter;
      const active = !activeFilter || (activeFilter === "active" ? u.active : !u.active);
      return kw && role && active;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name_az": return (a.username ?? "").localeCompare(b.username ?? "", "vi");
        case "name_za": return (b.username ?? "").localeCompare(a.username ?? "", "vi");
        default:        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [data, keyword, roleFilter, activeFilter, sortBy]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalActive = data.filter((u) => u.active).length;
  const totalLocked = data.filter((u) => !u.active).length;
  const totalOAuth  = data.filter((u) => u.provider !== "LOCAL").length;

  const stats = [
    { label: "Tổng người dùng", value: data.length,  icon: <PeopleAltOutlined />,  color: "primary.main" },
    { label: "Đang hoạt động",  value: totalActive,  icon: <CheckCircleOutlined />, color: "success.main" },
    { label: "Bị khoá",         value: totalLocked,  icon: <BlockOutlined />,       color: "error.main" },
    { label: "Đăng nhập OAuth", value: totalOAuth,   icon: <GoogleIcon />,          color: "info.main" },
  ];

  const toast = (message: string, type: SnackState["type"]) =>
    setSnack({ open: true, message, type });

  const handleToggleActive = async (user: User) => {
    try {
      await toggleActive.mutateAsync({ id: user.id, active: !user.active });
      toast(`${!user.active ? "Mở khoá" : "Khoá"} tài khoản ${user.email} thành công`, "success");
    } catch (e: any) {
      toast(e?.message ?? "Thao tác thất bại", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser.mutateAsync(deleteTarget.id);
      toast("Đã xoá người dùng thành công", "success");
    } catch (e: any) {
      toast(e?.message ?? "Xoá thất bại", "error");
    } finally {
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  return (
    <Box>
      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        {stats.map((s) => (
          <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "16px !important" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${s.color}20`, color: s.color }}>
                  {s.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700} lineHeight={1}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table card */}
      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <Box sx={{ px: 3, pt: 3, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Danh sách người dùng</Typography>
            <Typography variant="body2" color="text.secondary">
              {isLoading ? "Đang tải..." : `${filtered.length} người dùng`}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              ref={exportBtnRef}
              variant="outlined"
              size="small"
              startIcon={<FileDownloadOutlined />}
              endIcon={<KeyboardArrowDownIcon />}
              onClick={() => setExportMenuOpen(true)}
            >
              Xuất dữ liệu
            </Button>
            <Menu
              anchorEl={exportBtnRef.current}
              open={exportMenuOpen}
              onClose={() => setExportMenuOpen(false)}
              disableScrollLock
            >
              <MenuItem onClick={() => { exportCSV(filtered);   setExportMenuOpen(false); }}>CSV</MenuItem>
              <MenuItem onClick={() => { exportExcel(filtered); setExportMenuOpen(false); }}>Excel (.xlsx)</MenuItem>
              <MenuItem onClick={() => { exportPDF(filtered);   setExportMenuOpen(false); }}>PDF (In)</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Filter bar */}
        <Box sx={{ px: 3, pb: 1, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sắp xếp"
              MenuProps={{ disableScrollLock: true }}
            >
              {SORT_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.value === "newest" ? <><ArrowDownwardIcon sx={{ fontSize: 14, mr: 0.5 }} />{o.label}</> : o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
              label="Vai trò"
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Trạng thái TK</InputLabel>
            <Select
              value={activeFilter}
              onChange={(e) => { setActiveFilter(e.target.value); setPage(0); }}
              label="Trạng thái TK"
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="locked">Bị khoá</MenuItem>
            </Select>
          </FormControl>

          {hasFilter && (
            <Button size="small" variant="outlined" color="error" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </Box>

        {/* Active chips */}
        {hasFilter && (
          <Box sx={{ px: 3, pb: 1.5 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {roleFilter && (
                <Chip
                  label={`Vai trò: ${roleFilter === "ADMIN" ? "Admin" : "User"}`}
                  size="small"
                  onDelete={() => { setRoleFilter(""); setPage(0); }}
                />
              )}
              {activeFilter && (
                <Chip
                  label={`Trạng thái: ${activeFilter === "active" ? "Hoạt động" : "Bị khoá"}`}
                  size="small"
                  onDelete={() => { setActiveFilter(""); setPage(0); }}
                />
              )}
            </Stack>
          </Box>
        )}

        <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={0}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 56 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>Người dùng</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Liên hệ</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 90 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 100 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 110 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 110 }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      Ngày tham gia
                      {sortBy === "newest" && <ArrowDownwardIcon sx={{ fontSize: 13, color: "primary.main" }} />}
                      {sortBy === "oldest" && <ArrowUpwardIcon   sx={{ fontSize: 13, color: "primary.main" }} />}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 90 }} align="center">Khoá TK</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 90 }} align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 9 }).map((_, j) => (
                          <TableCell key={j}><Skeleton animation="wave" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : paged.length === 0
                  ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                          <Typography color="text.secondary">Không có dữ liệu</Typography>
                        </TableCell>
                      </TableRow>
                    )
                  : paged.map((u) => (
                      <TableRow hover key={u.id} sx={{ opacity: u.active ? 1 : 0.55 }}>
                        <TableCell>{u.id}</TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar src={avatarSrc(u)} alt={u.username} sx={{ width: 36, height: 36, fontSize: 14 }}>
                              {u.username?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 150 }}>
                                {u.username}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                                {u.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" noWrap>{u.phone ?? "—"}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 120 }}>
                            {u.address ?? ""}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={u.role === "ADMIN" ? "Admin" : "User"}
                            size="small"
                            color={u.role === "ADMIN" ? "secondary" : "default"}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip label={u.provider} size="small" color={u.provider === "LOCAL" ? "default" : "info"} variant="outlined" />
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={u.emailVerified ? "Xác thực" : "Chưa"}
                            size="small"
                            color={u.emailVerified ? "success" : "warning"}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title={u.active ? "Khoá tài khoản" : "Mở khoá"}>
                            <Switch
                              size="small"
                              checked={u.active}
                              onChange={() => handleToggleActive(u)}
                              color="success"
                            />
                          </Tooltip>
                        </TableCell>

                        <TableCell align="center">
                          <Box display="flex" justifyContent="center">
                            <Tooltip title="Chỉnh sửa">
                              <IconButton size="small" onClick={() => onEdit(u)}>
                                <EditOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xoá">
                              <IconButton size="small" color="error" onClick={() => setDeleteTarget(u)}>
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
            labelRowsPerPage="Hiển thị"
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          />
        </Paper>
      </Card>

      {/* Delete confirm */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => !deleting && setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xoá người dùng <strong>{deleteTarget?.username}</strong> ({deleteTarget?.email})?
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} variant="outlined" disabled={deleting}>Huỷ</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {deleting ? "Đang xoá..." : "Xoá"}
          </Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar
        open={snack.open}
        message={snack.message}
        type={snack.type}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}
