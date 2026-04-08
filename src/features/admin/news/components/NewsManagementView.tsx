"use client";

import { useMemo, useState, ChangeEvent, useRef } from "react";
import {
  Box, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, MenuItem,
  Paper, Stack, Switch, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Tabs, TextField, Tooltip, Typography,
  alpha, useTheme,
} from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { useToast } from "@/lib/toast/ToastContext";
import { useAdminNews, useCreateNews, useDeleteNews, useUpdateNews } from "../queries";
import {
  NEWS_CATEGORIES, NEWS_STATUS_COLOR, NEWS_STATUS_LABEL,
  NewsArticle, NewsStatus,
} from "../types";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

const DEFAULT_ROWS = 10;
const FILTER_TABS: { label: string; value: string }[] = [
  { label: "Tất cả", value: "" },
  { label: "Đã xuất bản", value: "PUBLISHED" },
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Lưu trữ", value: "ARCHIVED" },
];

const imgURL = (url?: string | null) =>
  url?.startsWith("http") ? url : url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${url}` : null;

/* ─────────────────────────────────────────────────────────
   Article Form Dialog
───────────────────────────────────────────────────────── */
interface FormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string;
  status: NewsStatus;
  pinned: boolean;
  thumbnailFile?: File;
  thumbnailPreview?: string;
}

const EMPTY_FORM: FormData = {
  title: "", summary: "", content: "", category: "",
  tags: "", status: "DRAFT", pinned: false,
};

interface ArticleDialogProps {
  open: boolean;
  editing: NewsArticle | null;
  onClose: () => void;
  onSave: (fd: FormData) => void;
  saving: boolean;
}

function ArticleDialog({ open, editing, onClose, onSave, saving }: ArticleDialogProps) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens/closes
  useMemo(() => {
    if (!open) { setForm(EMPTY_FORM); setTab(0); return; }
    if (editing) {
      setForm({
        title: editing.title,
        summary: editing.summary ?? "",
        content: editing.content ?? "",
        category: editing.category ?? "",
        tags: editing.tags ?? "",
        status: editing.status,
        pinned: editing.pinned,
        thumbnailPreview: imgURL(editing.thumbnail) ?? undefined,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setTab(0);
  }, [open, editing]);

  const handleFile = (file: File) => {
    setForm((f) => ({ ...f, thumbnailFile: file, thumbnailPreview: URL.createObjectURL(file) }));
  };

  const isValid = form.title.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableScrollLock
      PaperProps={{ sx: { height: "90vh" } }}>
      <DialogTitle sx={{ borderBottom: "1px solid", borderColor: "divider", fontWeight: 700, fontSize: "1.1rem" }}>
        {editing ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
      </DialogTitle>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Tab label="Nội dung" />
        <Tab label="Cài đặt & Thumbnail" />
      </Tabs>

      <DialogContent sx={{ flex: 1, overflow: "auto", py: 2.5 }}>
        {/* Tab 0: Content */}
        {tab === 0 && (
          <Stack spacing={2.5}>
            <TextField
              label="Tiêu đề bài viết *" fullWidth size="small"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              inputProps={{ maxLength: 500 }}
              helperText={`${form.title.length}/500`}
            />
            <TextField
              label="Tóm tắt" fullWidth multiline rows={3} size="small"
              placeholder="Mô tả ngắn hiển thị ở trang danh sách (tối đa 500 ký tự)..."
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              inputProps={{ maxLength: 500 }}
              helperText={`${form.summary.length}/500`}
            />
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={0.75} color="text.primary">
                Nội dung bài viết (HTML)
              </Typography>
              <TextField
                fullWidth multiline rows={18} size="small"
                placeholder="<h2>Tiêu đề</h2><p>Nội dung bài viết...</p>"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                sx={{ fontFamily: "monospace", "& textarea": { fontFamily: "monospace", fontSize: 13 } }}
              />
              <Typography variant="caption" color="text.secondary">
                Hỗ trợ HTML. Nội dung sẽ hiển thị đúng định dạng ở trang bài viết.
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Tab 1: Settings */}
        {tab === 1 && (
          <Stack spacing={2.5}>
            {/* Thumbnail upload */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={0.75}>Ảnh thumbnail</Typography>
              <Box
                sx={{
                  border: "2px dashed", borderColor: form.thumbnailPreview ? "primary.main" : "divider",
                  borderRadius: 2, p: 2, textAlign: "center", cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                }}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
              >
                {form.thumbnailPreview ? (
                  <Box sx={{ position: "relative", width: "100%", height: 200 }}>
                    <Image src={form.thumbnailPreview} alt="Thumbnail" fill style={{ objectFit: "cover", borderRadius: 8 }} />
                  </Box>
                ) : (
                  <Stack alignItems="center" spacing={1} py={3}>
                    <CloudUploadIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                    <Typography variant="body2" color="text.secondary">
                      Kéo & thả ảnh vào đây hoặc nhấn để chọn
                    </Typography>
                    <Typography variant="caption" color="text.disabled">JPG, PNG, WEBP — Tỉ lệ 16:9 khuyến nghị</Typography>
                  </Stack>
                )}
                <input ref={fileRef} type="file" hidden accept="image/*"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </Box>
              {form.thumbnailPreview && (
                <Button size="small" color="error" sx={{ mt: 0.5 }}
                  onClick={() => setForm((f) => ({ ...f, thumbnailFile: undefined, thumbnailPreview: undefined }))}>
                  Xóa ảnh
                </Button>
              )}
            </Box>

            <TextField
              select label="Danh mục" fullWidth size="small"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
              <MenuItem value="">— Chưa chọn —</MenuItem>
              {NEWS_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>

            <TextField
              label="Tags" fullWidth size="small"
              placeholder="máy khoan, pin lithium, makita (phân cách bằng dấu phẩy)"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              helperText="Các từ khóa giúp người đọc tìm bài viết liên quan"
            />

            <TextField
              select label="Trạng thái" fullWidth size="small"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as NewsStatus }))}
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
              <MenuItem value="DRAFT">Bản nháp — chỉ admin thấy</MenuItem>
              <MenuItem value="PUBLISHED">Xuất bản — hiển thị ngay cho người dùng</MenuItem>
              <MenuItem value="ARCHIVED">Lưu trữ — tạm ẩn</MenuItem>
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={form.pinned}
                  onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
                  color="warning"
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <PushPinIcon sx={{ fontSize: 18, color: form.pinned ? "warning.main" : "text.disabled" }} />
                  <Typography variant="body2">{form.pinned ? "Đang ghim lên đầu" : "Ghim bài viết lên đầu"}</Typography>
                </Stack>
              }
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={saving}>Hủy</Button>
        <Button
          variant="outlined"
          disabled={!isValid || saving}
          onClick={() => onSave({ ...form, status: "DRAFT" })}
        >
          Lưu nháp
        </Button>
        <Button
          variant="contained"
          disabled={!isValid || saving}
          onClick={() => onSave({ ...form, status: "PUBLISHED" })}
        >
          {saving ? "Đang lưu..." : "Xuất bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────────────────
   Main View
───────────────────────────────────────────────────────── */
export default function NewsManagementView() {
  const theme = useTheme();
  const { showToast } = useToast();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS);
  const [statusTab, setStatusTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const keyword = useSelector((s: AppState) => s.search.keyword.trim().toLowerCase());

  const { data, isLoading, isError } = useAdminNews(1, 1000);
  const allArticles = data?.result ?? [];

  const { mutateAsync: doCreate } = useCreateNews();
  const { mutateAsync: doUpdate } = useUpdateNews();
  const { mutateAsync: doDelete } = useDeleteNews();

  // Filter by status tab + global keyword
  const filtered = useMemo(() => {
    const tabStatus = FILTER_TABS[statusTab].value;
    return allArticles.filter((a) => {
      const matchStatus = !tabStatus || a.status === tabStatus;
      const matchKeyword =
        !keyword ||
        a.title.toLowerCase().includes(keyword) ||
        (a.category ?? "").toLowerCase().includes(keyword) ||
        (a.tags ?? "").toLowerCase().includes(keyword) ||
        (a.summary ?? "").toLowerCase().includes(keyword);
      return matchStatus && matchKeyword;
    });
  }, [allArticles, statusTab, keyword]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleOpenCreate = () => { setEditing(null); setDialogOpen(true); };
  const handleOpenEdit = (a: NewsArticle) => { setEditing(a); setDialogOpen(true); };

  const handleSave = async (form: FormData) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("summary", form.summary);
      fd.append("content", form.content);
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("status", form.status);
      fd.append("pinned", String(form.pinned));
      if (form.thumbnailFile) fd.append("thumbnail", form.thumbnailFile);

      if (editing) {
        await doUpdate({ id: editing.id, fd });
        showToast("Cập nhật bài viết thành công", "success");
      } else {
        await doCreate(fd);
        showToast("Thêm bài viết thành công", "success");
      }
      setDialogOpen(false);
      setPage(0);
    } catch (e: any) {
      showToast(e?.message || "Lỗi khi lưu bài viết", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await doDelete(deletingId);
      showToast("Đã xóa bài viết", "success");
    } catch (e: any) {
      showToast(e?.message || "Lỗi khi xóa bài viết", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const statusCounts = useMemo(() => ({
    "": allArticles.length,
    PUBLISHED: allArticles.filter((a) => a.status === "PUBLISHED").length,
    DRAFT: allArticles.filter((a) => a.status === "DRAFT").length,
    ARCHIVED: allArticles.filter((a) => a.status === "ARCHIVED").length,
  }), [allArticles]);

  return (
    <>
      <Card>
        <CardHeader
          title="Quản lý tin tức"
          titleTypographyProps={{ variant: "h5" }}
          subheader={`${allArticles.length} bài viết · ${statusCounts.PUBLISHED} đã xuất bản · ${statusCounts.DRAFT} bản nháp`}
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
              Thêm bài viết
            </Button>
          }
        />

        {/* Status filter tabs */}
        <Tabs
          value={statusTab}
          onChange={(_, v) => { setStatusTab(v); setPage(0); }}
          sx={{ px: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          {FILTER_TABS.map((t, i) => (
            <Tab
              key={t.value}
              label={
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <span>{t.label}</span>
                  <Chip
                    label={statusCounts[t.value as keyof typeof statusCounts] ?? 0}
                    size="small"
                    sx={{ height: 18, fontSize: 11, pointerEvents: "none" }}
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>

        <CardContent sx={{ p: 0 }}>
          <Paper>
            <TableContainer>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 80 }}>Thumbnail</TableCell>
                    <TableCell sx={{ minWidth: 250 }}>Tiêu đề</TableCell>
                    <TableCell sx={{ minWidth: 130 }}>Danh mục</TableCell>
                    <TableCell sx={{ minWidth: 110 }}>Trạng thái</TableCell>
                    <TableCell sx={{ minWidth: 60 }} align="center">Ghim</TableCell>
                    <TableCell sx={{ minWidth: 70 }} align="right">Lượt xem</TableCell>
                    <TableCell sx={{ minWidth: 110 }}>Ngày tạo</TableCell>
                    <TableCell sx={{ minWidth: 110 }}>Người tạo</TableCell>
                    <TableCell align="center" sx={{ minWidth: 120 }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading || isError ? (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Typography align="center" py={3}>
                          {isLoading ? "Đang tải..." : "Không thể tải dữ liệu"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Typography align="center" color="text.secondary" py={3}>
                          Không có bài viết nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginated.map((article) => {
                    const thumb = imgURL(article.thumbnail);
                    return (
                      <TableRow key={article.id} hover>
                        {/* Thumbnail */}
                        <TableCell>
                          <Box
                            sx={{
                              width: 72, height: 48, borderRadius: 1,
                              overflow: "hidden", bgcolor: "action.hover", position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            {thumb ? (
                              <Image src={thumb} alt={article.title} fill style={{ objectFit: "cover" }} unoptimized />
                            ) : (
                              <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <VisibilityIcon sx={{ fontSize: 20, color: "text.disabled" }} />
                              </Box>
                            )}
                          </Box>
                        </TableCell>

                        {/* Title */}
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}
                            sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {article.title}
                          </Typography>
                          {article.tags && (
                            <Typography variant="caption" color="text.disabled" noWrap sx={{ display: "block", maxWidth: 240 }}>
                              {article.tags}
                            </Typography>
                          )}
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          {article.category ? (
                            <Chip label={article.category} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Chip
                            label={NEWS_STATUS_LABEL[article.status]}
                            color={NEWS_STATUS_COLOR[article.status]}
                            size="small"
                          />
                        </TableCell>

                        {/* Pinned */}
                        <TableCell align="center">
                          {article.pinned ? (
                            <PushPinIcon sx={{ fontSize: 18, color: "warning.main" }} />
                          ) : (
                            <PushPinOutlinedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                          )}
                        </TableCell>

                        {/* Views */}
                        <TableCell align="right">
                          <Typography variant="body2" fontFamily="monospace">
                            {article.viewCount.toLocaleString("vi-VN")}
                          </Typography>
                        </TableCell>

                        {/* Created date */}
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                          </Typography>
                        </TableCell>

                        {/* Created by */}
                        <TableCell>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {article.createdBy || "—"}
                          </Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <Tooltip title="Chỉnh sửa">
                              <IconButton size="small" onClick={() => handleOpenEdit(article)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa bài viết">
                              <IconButton size="small" color="error" onClick={() => setDeletingId(article.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
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
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <ArticleDialog
        open={dialogOpen}
        editing={editing}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deletingId} onClose={() => setDeletingId(null)} disableScrollLock maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa bài viết này không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingId(null)} color="inherit">Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
